import { Form, useLoaderData,useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";


export async function action({ request, params }) {
  let formData = await request.formData();
  // updating the contact to have the star
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

// Add a loader to the contact page and access data with useLoaderData
export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { contact };
}


export default function Contact() {
    const { contact } = useLoaderData();
    console.log(contact)
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

            {contact.github && (
            <p>
                <a
                target="_blank"
                href={`https://github.com/${contact.github}`}
                >
                {contact.github}
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
  const fetcher = useFetcher();
  // yes, this is a `let` for later
  let favorite = contact.favorite;

  // to make the clicking of the star button more responsive
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
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}