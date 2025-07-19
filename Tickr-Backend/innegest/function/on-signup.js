import { innegest } from '../client.js';
import { User } from '../../models/user.js'; // Assuming you have a User model defined
import { sendMail } from '../../utils/mail.js';
export const onUserSignup = innegest.createFunction({},
    {id:"on-user-signup", retries:2},
    {event: "user/signup"},
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
            await step.run("send-welcome-email", async () => {
                const subject= `Welcome to Inngest`;
                const message=`Hi
                \n\n
                Thanks for signing up. we're glad to have you onboard!`
                await sendMail(user.email, subject, message);

            })
            return {success: true}
        }catch(error){
            console.error("Error running step", error.message);
            return {success: false}
        }
        
    }

);
