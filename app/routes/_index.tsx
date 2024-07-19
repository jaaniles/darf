import type { MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { db } from "~/firebase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const action = async () => {
  console.log("action lähti");

  const docRef = db.collection("lobbies").doc();
  const created = await docRef.create({
    hello: "world",
  });

  console.log("CREATED?", created);

  return {
    redirect: "/",
  };

  /*
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();

  const amount = formData.get("amount");
  const isToday = formData.get("today");
  const date = isToday
    ? new Date().toISOString().split("T")[0]
    : formData.get("date");

  const success = await createDeposit({
    request,
    amount: Number(amount),
    date: date as string,
  });

  if (!success) {
    return redirect("/?error=true");
  }

  session.flash("globalMessage", "Deposit created successfully!");

  return redirect("/", {
    headers: {
      "Set-cookie": await commitSession(session),
    },
  });
  */
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <Link to="/lobby">createlobby page</Link>

      <Form method="post" action="/joinLobby">
        <input type="text" name="lobbyId" />
        <button type="submit">Join lobby</button>
      </Form>
    </div>
  );
}
