import { inngest } from '../client.js';
import  Ticket  from '../../models/ticket.js';
import { sendMail } from '../../utils/mail.js';
import User from '../../models/user.js';
import { NonRetriableError } from 'inngest';
import analyzeTicket from '../../utils/aiAgent.js';
export const onTicketCreated = inngest.createFunction(
   {id:"on-ticket-created", retries:2},
    {event: "ticket/created"},
    async({event, step})=>{
        try {
            const {ticketId}= event.data;

            // Fetch ticket details from the database
         const ticket = await step.run("fetch-ticket", async () => {
            const ticketObject = await Ticket.findById(ticketId)
            if (!ticketObject) {
                throw new NonRetriableError("Ticket not found");
            }
            return ticketObject;
         })

         await step.run("update-ticket-status", async ()=>{
            await Ticket.findByIdAndUpdate(ticket._id,{
                status: 'TODO'
            })
            
         })   
            const aiResponse= await analyzeTicket(ticket);
            const relatedSkills=await step.run("ai-processing", 
            async()=>{
                let skills=[]
                if(aiResponse){
                await Ticket.findByIdAndUpdate(ticket._id,{
                    prority:['low', 'medium', 'high']
                    .includes(aiResponse.priority) ? 'medium': aiResponse.priority,
                    helpfulNotes: aiResponse.helpfulNotes,
                    status: "IN_PROGRESS",
                    relatedSkills: aiResponse.relatedSkills
                })
                skills= aiResponse.relatedSkills;
               }
               return skills;
            })
            const moderator= await step.run("assign-moderator",
                async()=>{
                    let user= await User.findOne({
                        role: 'moderator',
                        skills:{
                            $elseMatch:{
                                $regex: relatedSkills.join('|'),
                                $options: 'i'
                            },
                        },
                    });
                    if(!user){
                        user = await User.findOne({role: 'moderator'});
                    }
                    await Ticket.findByIdAndUpdate(ticket._id,{
                        assignedTo: user._id
                    });
                    return user;
                });

            await step.run("send-email-notification",
                async()=>{
                    if(moderator){
                        const finalTicket= await Ticket.findById(ticket._id)
                        await sendMail(
                            moderator.email,
                            "New Ticket Assigned",
                            ` A new ticket has been assigned to you.
                             ${finalTicket.title}`
                            
                        )
                    }
                }
            ) 
            return {success: true};
        } catch (error) {
            console.error("Error running step", error.message);
            return {success: false}
        }
    }
)