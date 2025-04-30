

import { httpServer } from ".";


httpServer.listen(process.env.PORT , ()=>{
    console.log(`App is running at port ${process.env.PORT  }`)
});