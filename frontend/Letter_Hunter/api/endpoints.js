// Server link is now one variable that is easy to change if the server ip changes.
const serverLink = "http://137.184.74.25:3000";

export const fetchGetWord = async () => {
  return fetch(serverLink + "/get-word");
};

export const postImage = async (data) => {
  return fetch(serverLink + "/image", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const postJoinRoom = async (data) => {
  return fetch(serverLink + "/join-room", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};