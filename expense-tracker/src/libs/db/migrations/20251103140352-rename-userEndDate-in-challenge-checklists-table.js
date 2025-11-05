/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn('ChallengeChecklists', 'userEndDate', 'userExpireDate');
  },

  async down(queryInterface) {
    await queryInterface.renameColumn('ChallengeChecklists', 'userExpireDate', 'userEndDate');
  },
};
