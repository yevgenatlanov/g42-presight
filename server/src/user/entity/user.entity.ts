// This is done for data structure and flexibility, type is our friend

export interface User {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;
  hobbies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel implements User {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;
  hobbies: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<User>) {
    this.id = data.id || "";
    this.avatar = data.avatar || "";
    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.age = data.age || 0;
    this.nationality = data.nationality || "";
    this.hobbies = data.hobbies || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
