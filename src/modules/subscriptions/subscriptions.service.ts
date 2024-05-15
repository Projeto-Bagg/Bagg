import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwt: JwtService
    ) { }
    //sub service session main logic:
//     @ApiBearerAuth()
//     async createStripeSessionForSubscription(@CurrentUser currentUser: UserFromJwt, req, res) {
//         const Stripe = require('stripe');
//         const stripe = Stripe(process.env.STRIPE_TEST_SECRET)

//         const user = await this.prismaService.account.findUnique({
//             where: {
//                 id: currentUser.id,
//             },
//         });

//         const auth0UserId = user?.email;

//         const customersSet = await stripe.customers.list({
//             email: auth0UserId,
//             limit: 1,
//         });

//         if (customersSet.data.length > 0) {
//             var customer = customersSet.data[0];
            
//             const subscriptions = await stripe.subscriptions.list({
//                 customer: customer.id,
//                 status: "active",
//                 limit: 1,
//             });

//             if (subscriptions.data.length > 0) {
//                 //will send to stripe billigng manager.

//                 const stripeSession = await stripe.billingPortal.sessions.create({
//                     customer: customer.id,
//                     return_url: "https://localhost:3001/subscriptions" //Bagg stripe actual page 
//                 });
//                 return res.status(409).json({ redirectUrl: stripeSession.url });
//             }
//         }

//     }
}
