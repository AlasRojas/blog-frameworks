import { Button, Label, TextInput, Card } from 'flowbite-react';

export default function AdminLogin() {
  return (
    <div>
      <Card>
        <h1>Admin Login</h1>
        <Button>Login Google</Button>
        <Button>Login Github</Button>
        <form>
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput id="email" type="email" placeholder="Enter your email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <TextInput id="password" type="password" placeholder="Enter your password" />
          </div>
          <Button type="submit">Login</Button>
        </form>
      </Card>
    </div>
  )
}