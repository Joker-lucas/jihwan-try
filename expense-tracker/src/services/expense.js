const { Expense, FinancialYear, sequelize } = require('../libs/db/models');
const { error, errorDefinition } = require('../libs/common');
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const _getFinancialYearId = async (dateString, transaction) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const [financialYear] = await FinancialYear.findOrCreate({
        where: { year, month },
        transaction
    });

    return financialYear.financialYearId;
};

const getExpenses = async (userId, year, month, limit, offset) => {
    const whereClause = {};

    whereClause.userId = userId;

    if (year && month) {
        const financialYear = await FinancialYear.findOne({
            where: { year: parseInt(year), month: parseInt(month) }
        });

        if (financialYear) {
            whereClause.financialYearId = financialYear.financialYearId;
        } else {
            return { totalCount: 0, expenses: [] }; 
        }
    }

    const { count, rows } = await Expense.findAndCountAll({
        where: whereClause,
        order: [['date', 'DESC']],
        limit: limit,
        offset: offset
    });

    return {
        totalCount: count,
        expenses: rows 
    };
};

const getExpenseById = async (userId, expenseId) => { 
    const expense = await Expense.findOne({
        where: {
            expenseId: parseInt(expenseId), 
            userId: userId
        }
    });

    if (!expense) {
        throw new CustomError(ERROR_CODES.NOT_FOUND);
    }

    return expense; 
};

const createExpense = async (userId, expenseData) => { 
    const { date, amount, category, status, description, paymentMethod } = expenseData;
    try {
        const financialYearId = await _getFinancialYearId(date);

        const newExpense = await Expense.create({
            userId,
            financialYearId,
            date,
            amount,
            category,
            paymentMethod, 
            status,
            description
        });

        return newExpense; 
    } catch (error) {
        throw error;
    }
};

const updateExpense = async (userId, expenseId, updateData) => { 
    const { date, amount, category, status, description, paymentMethod } = updateData;

    const t = await sequelize.transaction();
    try {

        const expense = await Expense.findOne({
            where: {
                expenseId: parseInt(expenseId),
                userId: userId
            },
            transaction: t
        });

        if (!expense) {
            throw new CustomError(ERROR_CODES.NOT_FOUND);
        }

        const newValues = {};
        if (date) newValues.date = date;
        if (amount) newValues.amount = amount;
        if (category) newValues.category = category;
        if (status) newValues.status = status;
        if (paymentMethod) newValues.paymentMethod = paymentMethod; 
        if (description !== undefined) newValues.description = description;

        if (date && expense.date !== date) {
            newValues.financialYearId = await _getFinancialYearId(date, t);
        }

        await expense.update(newValues, { transaction: t });

        await t.commit();
        return expense;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};


const deleteExpense = async (userId, expenseId) => { 
    const deletedRows = await Expense.destroy({
        where: {
            expenseId: parseInt(expenseId), 
            userId: userId
        }
    });

    if (deletedRows === 0) {
        throw new CustomError(ERROR_CODES.NOT_FOUND);
    }

    return true;
};


module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
};