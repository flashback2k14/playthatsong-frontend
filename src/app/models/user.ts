export class User {
  _id: string;
  name: string;
  password: string;
  admin: boolean;
  deejay: boolean;
  created: Date;
  availableVotes: number;
  firstVoting: Date;
}