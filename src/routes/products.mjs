import { Router } from "express";
const router = Router();
//products

router.get("/api/products", (request, response) => {
  console.log(request.headers.cookie, "checkcookie1");

  console.log(request.cookies, "checkcookie2");
  if (request.cookies.hello && request.cookies.hello === "world")
   return response.send([
      {
        id: 123,
        name: "bag",
        price: 200,
      },
    ]);
 return response.status(403).send({msg:"Sorry, you need the correct cookie"})
});

export default router;
