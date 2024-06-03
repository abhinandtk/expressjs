import { Router } from "express";
import { query,validationResult,checkSchema,matchedData } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { validationSchema } from "../utils/validationSchema.mjs";
import { resolveIndexbyUserid } from "../utils/middleware.mjs";

const router = Router();


//Get all users

router.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("Must be string")
    .notEmpty()
    .withMessage("Must be not empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be atleast 3 to 10 characters"),
  (request, response) => {
      // console.log(request.session)
      // console.log(request.session.id)
    request.sessionStore.get(request.session.id,(err,sessionData)=>{
      if(err){
        console.log(err);
        throw err
      }
      console.log(sessionData);
    })
    const result = validationResult(request);
    // console.log(result, "checkquery");
    const {
      query: { filter, value },
    } = request;
    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );
    return response.send(mockUsers);
  }
);

//Add users
router.post("/api/users", checkSchema(validationSchema), (request, response) => {
    const result = validationResult(request);
    console.log(result.isEmpty(), "checkrequest");
    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });
    const data = matchedData(request);
    console.log("checkdata", data);
    // const { body } = request;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
  });

  //getUser
router.get("/api/users/:id", resolveIndexbyUserid, (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);
    console.log(parseId, "checkpddarseid");
  });

  //Update user
router.put("/api/users/:id", resolveIndexbyUserid, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.status(200).send(mockUsers[findUserIndex]);
  });

  
//Update user
router.patch("/api/users/:id", resolveIndexbyUserid, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.status(200).send(mockUsers[findUserIndex]);
  });
  
  //Delete user
  router.delete("/api/users/:id", resolveIndexbyUserid, (request, response) => {
    const { findUserIndex } = request;
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);
  });
  

export default router
