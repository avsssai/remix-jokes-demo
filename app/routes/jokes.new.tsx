import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";

function validateJokeContent(content: string) {
	if (content.length < 3) {
		return "That joke's is too short.";
	}
}

function validateJokeName(name: string) {
	if (name.length < 10) {
		return "The joke's name is too short.";
	}
}

interface Fields {
	name?: string;
	content?: string;
}
interface Errors {
	fieldErrors: Fields | null;
	fields: Fields | null;
	formError: string | null;
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const formData = await request.formData();

	const name = formData.get("name");
	const content = formData.get("content");
	if (typeof name !== "string" || typeof content !== "string") {
		return badRequest<Errors>({
			fieldErrors: null,
			fields: null,
			formError: "Form not submitted correctly",
		});
	}
	const fieldErrors = {
		name: validateJokeName(name),
		content: validateJokeContent(content),
	};
	const fields = { name, content };

	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest<Errors>({ fieldErrors, fields, formError: null });
	}
	const joke = await db.joke.create({ data: { name, content } });
	return redirect(`/jokes/${joke.id}`);
};

export default function NewJoke() {
	const data = useActionData<typeof action>();
	console.log(data);
	return (
		<div>
			<p>Add your own hilarious joke.</p>
			<form method='post'>
				<div>
					<label>
						Name:{" "}
						<input
							name='name'
							defaultValue={data?.fields?.name}
							aria-invalid={Boolean(data?.fieldErrors?.name)}
							type='text'
							aria-errormessage={
								data?.fieldErrors?.name
									? "name-error"
									: undefined
							}
						/>
					</label>
					{data?.fieldErrors?.name ? (
						<p
							className='form-validation-error'
							id='name-error'
							role='alert'>
							{data.fieldErrors.name}
						</p>
					) : (
						""
					)}
				</div>
				<div>
					<label htmlFor='content'>
						Content:{" "}
						<textarea
							name='content'
							defaultValue={data?.fields?.content}
							aria-invalid={Boolean(data?.fieldErrors?.content)}
							aria-errormessage={
								data?.fieldErrors?.content
									? "content-error"
									: undefined
							}
						/>
					</label>
					{data?.fieldErrors?.content ? (
						<p
							className='form-validation-error'
							role='alert'
							id='name-error'>
							{data.fieldErrors.content}
						</p>
					) : (
						""
					)}
				</div>
				<div>
					<button type='submit' className='button'>
						Add
					</button>
				</div>
			</form>
		</div>
	);
}
