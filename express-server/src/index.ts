// import "reflect-metadata";
// import { AppDataSource } from "./data-source";
// import { Photo } from "./entity/Photo";


// const dataView = async () => {
//     const savedPhotos = await AppDataSource.manager.find(Photo);
//     console.log("--- 모든 사진 ---");
//     console.log(savedPhotos);
//     console.log("-----------------------");
// }

// const startServer = async () => {
//     try {
//         await AppDataSource.initialize();
//         console.log("데이터베이스 연결 성공!");

//         const newPhoto = new Photo();
//         newPhoto.name = "Me and Bears";
//         newPhoto.description = "I am near polar bears";
//         newPhoto.filename = "photo-with-bears.jpg";
//         newPhoto.views = 1;
//         newPhoto.isPublished = true;

//         await AppDataSource.manager.save(newPhoto);
//         console.log("사진이 성공적으로 저장되었습니다. Photo ID:", newPhoto.id);

        
//         await dataView();
        
//     } catch (error) {
//         console.error("데이터베이스 연결 실패:", error);
//     }
// };

// startServer();


import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.js';
import { User } from './modules/user/User.entity.js';


const dataView = async (orm: MikroORM) => {
  const em = orm.em.fork();
  const savedUsers = await em.find(User, {});
  console.log("--- 모든 사용자 ---");
  console.log(savedUsers);
  console.log("-----------------------");
};

const startServer = async () => {
  const orm = await MikroORM.init(config);
  console.log("데이터베이스 연결 성공!");

  try {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();

    const em = orm.em.fork();

    const newUser = new User();
    newUser.fullName = "Foo Bar";
    newUser.email = "foo@bar.com'";
    newUser.password = "123456";
    newUser.bio = "...";
    
    await em.persist(newUser).flush();
    console.log(newUser.id);

    await dataView(orm);
    
  } catch (error) {
    console.error("오류가 발생했습니다:", error);
  } finally {
    await orm.close(true);
  }
};

startServer();