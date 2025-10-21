const { Income, FinancialYear, sequelize } = require('../libs/db/models');
const { error, errorDefinition } = require('../libs/common');
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;


const _getFinancialYearId = async (dateString, transaction) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const [financialYear] = await FinancialYear.findOrCreate({
        where: { year, month },
        defaults: { year, month },
        transaction
    });

    return financialYear.financialYearId;
};


const getAllIncomes = async (userId, year, month) => {
    const whereClause = {};

    if (userId !== null) {
        whereClause.userId = userId;
    }
    if (year && month) {
        const financialYear = await FinancialYear.findOne({
            where: { year: parseInt(year), month: parseInt(month) }
        });

        if (financialYear) {
            whereClause.financialYearId = financialYear.financialYearId;
        } else {
            return []; 
        }
    }

    const incomes = await Income.findAll({
        where: whereClause,
        order: [['date', 'DESC']]
    });

    return incomes;
};

const createIncome = async (userId, incomeData) => {
    const { date, amount, category, status, description } = incomeData;

    const t = await sequelize.transaction();
    try {
        const financialYearId = await _getFinancialYearId(date, t);

        const newIncome = await Income.create({
            userId,
            financialYearId,
            date,
            amount,
            category,
            status,
            description
        }, { transaction: t });

        await t.commit();
        return newIncome;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

const updateIncome = async (userId, incomeId, updateData) => {
    const { date, amount, category, status, description } = updateData;

    const t = await sequelize.transaction();
    try {
        const income = await Income.findOne({
            where: {
                incomeId: parseInt(incomeId),
                userId: userId
            },
            transaction: t
        });

        if (!income) {
            throw new CustomError(ERROR_CODES.NOT_FOUND);
        }

        const newValues = {};
        if (date) newValues.date = date;
        if (amount) newValues.amount = amount;
        if (category) newValues.category = category;
        if (status) newValues.status = status;
        if (description !== undefined) newValues.description = description;

        if (date && income.date !== date) {
            newValues.financialYearId = await _getFinancialYearId(date, t);
        }

        await income.update(newValues, { transaction: t });

        await t.commit();
        return income;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

const deleteIncome = async (userId, incomeId) => {
    const deletedRows = await Income.destroy({
        where: {
            incomeId: parseInt(incomeId),
            userId: userId
        }
    });

    if (deletedRows === 0) {
        throw new CustomError(ERROR_CODES.NOT_FOUND);
    }

    return true;
};


module.exports = {
    createIncome,
    getAllIncomes,
    updateIncome,
    deleteIncome,
};