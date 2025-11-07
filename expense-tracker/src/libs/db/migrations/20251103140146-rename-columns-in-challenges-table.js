/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn('Challenges', 'limitTime', 'limitDay');
    await queryInterface.renameColumn('Challenges', 'challengeEndDate', 'challengeExpireDate');
  },

  async down(queryInterface) {
    await queryInterface.renameColumn('Challenges', 'limitDay', 'limitTime');
    await queryInterface.renameColumn('Challenges', 'challengeExpireDate', 'challengeEndDate');
  },
};
