import Link from 'next/link'

export default function Dashboard() {
  return (
  	<>
  	<h1>Dashboard</h1>
  	<h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
      <h3>This is the dashboard!</h3>
     </>
    )
}
