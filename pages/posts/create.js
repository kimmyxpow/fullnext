import React, { useState } from "react";
import { authPage } from "../../middlewares/authorizationPage";
import Router from "next/router";
import Nav from "../../components/Nav";

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);

	return { props: { token } };
}

export default function PostCreate(props) {
	const [fields, setFields] = useState({ title: "", content: "" });
	const [status, setStatus] = useState("normal");

	async function createHandler(e) {
		e.preventDefault();

		setStatus("loading");

		const { token } = props;

		const create = await fetch("/api/posts/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
			body: JSON.stringify(fields),
		});

		if (!create.ok) return setStatus("error" + create.status);

		const res = await create.json();

		setStatus("success");

		Router.push("/posts");
	}

	function fieldHandler(e) {
		const name = e.target.getAttribute("name");

		setFields({
			...fields,
			[name]: e.target.value,
		});
	}

	return (
		<div>
			<h1>Create a Post</h1>
			<Nav />
			<form onSubmit={createHandler.bind(this)}>
				<input type="text" placeholder="Title" name="title" onInput={fieldHandler.bind(this)} />

				<br />

				<textarea placeholder="Content" name="content" onInput={fieldHandler.bind(this)}></textarea>

				<br />

				<button type="submit">Create Post</button>
				<div>Status: {status}</div>
			</form>
		</div>
	);
}
