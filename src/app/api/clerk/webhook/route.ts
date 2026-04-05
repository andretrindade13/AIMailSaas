
import { db } from "@/server/db";

export const POST = async (req: Request) => {
    const body = await req.json() as { data: unknown };
    const { data } = body;

    const emailAddress = (data as any)?.email_addresses?.[0]?.email_address;
    const firstName = (data as any)?.first_name;
    const lastName = (data as any)?.last_name;
    const id = (data as any)?.id;
    const imageURL = (data as any)?.image_url

    if(emailAddress === undefined || firstName === undefined || lastName === undefined || id === undefined || imageURL === undefined) {
        return new Response('Invalid payload', { status: 400 });
    }
    
    await db.user.upsert({
        where: { id: id },
        update: {
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            imageUrl: imageURL
        },
        create: {
            id: id,
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            imageUrl: imageURL
        }
    })

    return new Response('Webhook received', { status: 200 });
}