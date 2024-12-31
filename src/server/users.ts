interface User {
    nickname: string;
  }
  
  const dummyUsers: User[] = [];
  
  export const createUser = async (nickname: string) => {
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        const user = { nickname };
        dummyUsers.push(user);
        resolve(user);
      }, 300);
    });
  };
  
  export const getUsers = async () => {
    return new Promise<User[]>((resolve) => {
      setTimeout(() => {
        resolve(dummyUsers);
      }, 300);
    });
  };
  