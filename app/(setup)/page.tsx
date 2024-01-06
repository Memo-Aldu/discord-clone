import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { InitialModel } from "@/components/modals/initial-modal";

const SetupPage = async () => {
    const profile = await initialProfile();

    // find the first server where the profile is a member
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }

    });

    if (server) {
        return redirect(`/servers/${server.id}`)
    }

    return <InitialModel/>;
}
 
export default SetupPage;