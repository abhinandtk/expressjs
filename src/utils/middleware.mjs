import { mockUsers } from "./constants.mjs";


export const resolveIndexbyUserid = (request, response, next) => {
    const {
      body,
      params: { id },
    } = request;
    const parseId = parseInt(id);
    console.log(
      mockUsers.findIndex((value) => value.id === parseId),
      "checkuser1"
    );
  
    if (isNaN(parseId)) return response.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((value) => value.id === parseId);
    if (findUserIndex === -1) return response.sendStatus(404);
    request.findUserIndex = findUserIndex;
    next();
  };