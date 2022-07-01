import React, { useEffect, useState } from "react";
import styles from "../styles/users.module.css";
import { collection, getFirestore, getDocs } from "firebase/firestore";

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const db = getFirestore();
        const colRef: any = collection(db, "users");
        const { docs }: any = await getDocs(colRef);
        let users: any[] = [];
        docs.forEach((doc: any) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        setUsers(users);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className={styles.wrap}>
      <h1 className={styles.h1}>Users</h1>
      {!loading ? (
        <ul className={styles.ul}>
          {users.map((user, idx) => (
            <li key={idx} className={styles.li}>
              {user.username}
            </li>
          ))}
        </ul>
      ) : (
        <p>loading....</p>
      )}
    </div>
  );
};

export default Users;
