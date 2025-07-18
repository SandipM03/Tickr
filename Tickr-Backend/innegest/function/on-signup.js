import { innegest } from '../client.js';
import { User } from '../../models/user.js'; // Assuming you have a User model defined
export const onUserSignup = innegest.createFunction({},
    {id:"on-user-signup", retries:2},
    {event: "app/signup"},
    async({event, step})=>{
        try {
            const {email}= event.data;
          const user=  await step.run("get-user-email",async()=>{
             const userObject =  await User.findOne({email})
               if(!userObject){
                   throw new NonRetriableError("User not found");
               }
               return userObject;
            });
        }catch(error){
            console.error("Error in onUserSignup:", error);
        }
        
    }

);
