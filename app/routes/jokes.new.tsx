export default function NewJoke() {
	return (
		<div>
			<p>Add your own hilarious joke!</p>
			<form method='post'>
				<label htmlFor='jokeTitle'>
					Joke Title
					<br />
					<input type='text' name='jokeTitle' />
				</label>
				<br />
				<br />
				<label htmlFor='jokeContent'>
					Joke Content
					<br />
					<textarea rows={10} cols={100} name='jokeContent' />
				</label>
				<br />
				<button type='submit'>Add new Joke</button>
			</form>
		</div>
	);
}
