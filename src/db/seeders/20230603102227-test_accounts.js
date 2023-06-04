'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('test_accounts',[
      {email:'chrisagulter9642@gmail.com',password:'gwbkzjtgfcyqqrxm',domain:'smtp.gmail.com',port:587},
      {email:'eolabrian9655@gmail.com',password:'onrwvwvxflixmjvd',domain:'smtp.gmail.com',port:587},
      {email:'ellywhite7344@gmail.com',password:'osdrqquhlsoopirl',domain:'smtp.gmail.com',port:587},
      {email:'aillybrown8422@gmail.com',password:'lfrrsxlsherhwtgv',domain:'smtp.gmail.com',port:587},
      {email:'emilyohail9863@gmail.com',password:'kkhesyhvqokmnhwb',domain:'smtp.gmail.com',port:587},
      {email:'tomogawa7321@gmail.com',password:'egjtepitxkeckkwg',domain:'smtp.gmail.com',port:587},
      {email:'robinsimth9663@gmail.com',password:'tmfsgovqbestvcb',domain:'smtp.gmail.com',port:587},
      {email:'yotamball846d@gmail.com',password:'gtnracznomujluhu',domain:'smtp.gmail.com',port:587},
      {email:'kanewilliamson298d@gmail.com',password:'uriuxowirmpbnsso',domain:'smtp.gmail.com',port:587},
      {email:'augustabaily7433@gmail.com',password:'gfofbehkjlhrtcvm',domain:'smtp.gmail.com',port:587},
      {email:'jimlarry7652@gmail.com',password:'dzxkrtfigikvtwxu',domain:'smtp.gmail.com',port:587},

    ])
    /** 
     * Add seed commands here.
     * chrisagulter9642@gmail.com	275sona275	 nitinsahu287290@gmail.com	gwbkzjtgfcyqqrxm
eolabrian9655@gmail.com	276sona276	 nitinsahu287290@gmail.com	onrwvwvxflixmjvd
ellywhite7344@gmail.com	277sona277	 nitinsahu287290@gmail.com	osdrqquhlsoopirl

aillybrown8422@gmail.com	278sona278	 nitinsahu287290@gmail.com	lfrrsxlsherhwtgv
emilyohail9863@gmail.com	279sona279	 nitinsahu287290@gmail.com	kkhesyhvqokmnhwb

tomogawa7321@gmail.com	280sona280	 nitinsahu287290@gmail.com	egjtepitxkeckkwg
robinsimth9663@gmail.com	281sona281	 nitinsahu287290@gmail.com	tmfsgovqbestvcb

jimlarry7652@gmail.com	282sona282	 nitinsahu287290@gmail.com	dzxkrtfigikvtwxu
augustabaily7433@gmail.com	283sona283	 nitinsahu287290@gmail.com	gfofbehkjlhrtcvm
kanewilliamson298d@gmail.com	284sona284	 nitinsahu287290@gmail.com	uriuxowirmpbnsso
yotamball846d@gmail.com	285sona285	 nitinsahu287290@gmail.com	gtnracznomujluhu

     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
