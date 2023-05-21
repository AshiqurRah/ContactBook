import { Outlet, NavLink, useLoaderData,Form, redirect, useNavigation, useSubmit } from "react-router-dom";
// An <Outlet> should be used in parent route elements to render their child route elements. 
// This allows nested UI to show up when child routes are rendered. If the parent route matched exactly, 
// it will render a child index route or nothing if there is no index route.
import { getContacts,  createContact  } from "../contacts";
import { useEffect } from "react";

export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
}

export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts, q };
}


export default function Root() {
    const { contacts, q } = useLoaderData();
    const navigation = useNavigation();
    const submit = useSubmit();

    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has("q");

    useEffect(() => {
        document.getElementById("q").value = q;
    }, [q]);

    return (
        <>
            <div id="sidebar">
                <h1>ContactBook by React Router</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            className={searching ? "loading" : ""}
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            onChange={(event) => {
                                const isFirstSearch = q == null;
                                submit(event.currentTarget.form, {
                                replace: !isFirstSearch,
                                });
                            }}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        />
                        <div
                        className="sr-only"
                        aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                        {contacts.map((contact) => (
                            <li key={contact.id}>
                                <NavLink
                                    to={`contacts/${contact.id}`}
                                    className={({ isActive, isPending }) =>
                                    isActive
                                        ? "active"
                                        : isPending
                                        ? "pending"
                                        : ""
                                    }
                                >
                                    {contact.first || contact.last ? (
                                    <>
                                        {contact.first} {contact.last}
                                    </>
                                    ) : (
                                    <i>No Name</i>
                                    )}{" "}
                                    {contact.favorite && <span>★</span>}
                                </NavLink>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p>
                        <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div 
                id="detail"
                className={
                    navigation.state === "loading" ? "loading" : ""
                  }
            >
                <Outlet/>
            </div>
        </>
    );
}