import { useLoaderData, Form, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";


export async function action({ request, params }) {
    let formData = await request.formData();
    return updateContact(params.contactId, {
        favorite: formData.get("favorite") === "true",
    });
}
export async function loader({ params }) {
    const contact = await getContact(params.contactId);
    if (!contact) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        })
    }
    return { contact };
}

// export async function loader() {
//     const contacts = await getContacts();
//     return { contacts };
// }

export default function Contact() {

    const { contact } = useLoaderData();
    // const contact = {
    //     first:"Jarissa",
    //     last: "Drummond",
    //     avatar: "https://media.licdn.com/dms/image/D4E03AQEb-p0t7pOESg/profile-displayphoto-shrink_800_800/0/1697732634716?e=2147483647&v=beta&t=rPv87eEivG6FThfaAij2aoYhHvOdrA5-Z9zqJsVC4hU",
    //     twitter: "@semiiJ415",
    //     notes: "Some notes... She sure can hit em!",
    //     favorite: true,


    return (
        <div id="contact">
            <div>
                <img 
                    key={contact.avatar}
                    src={contact.avatar || null}
                />
            </div>


        <div>
            <h1>
                {contact.first || contact.last ? (
                    <>
                        {contact.first} {contact.last}
                    </>
                ) : (
                    <i>No Name</i>
                )}{" "}
                <Favorite contact={contact} />
            </h1>

            {contact.twitter && (
                <p>
                    <a 
                        target="_blank" 
                        href={`https://twitter.com/${contact.twitter}`}
                    >
                        {contact.twitter}
                    </a>
                </p>
            )}

            {contact.notes && <p>{contact.notes}</p>}

            <div>
                <Form action="edit">
                    <button type="submit">Edit</button>
                </Form>
                <Form
                    method="post" 
                    action="destroy"
                    onSubmit={(event) => {
                        if (
                            !confirm(
                                "Please confirm you want to delete this record."
                            )
                        ) {
                            event.preventDefault();
                        }
                    }}
                >
                    <button type="submit">Delete</button>
                </Form>
            </div>
        </div>
    </div>
    );
}

function Favorite({ contact }) {
    //yes, this is a `let` for later
    const fetcher = useFetcher();
    let favorite = contact.favorite;
    if (fetcher.formData) {
        favorite = fetcher.formData.get("favorite") === "true";
    }

    return (
        <fetcher.Form method="post">
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★": "☆"}
            </button>
        </fetcher.Form>
    )
}