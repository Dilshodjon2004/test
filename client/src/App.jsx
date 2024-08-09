import {useState} from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [post, setPost] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const postId = response.data.postId;
      console.log(postId);

      const postResponse = await axios.get(
        `http://localhost:5000/posts/${postId}`,
      );
      setPost(postResponse.data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  console.log(post);

  return (
    <div>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder='Body'
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <input type='file' onChange={handleFileChange} required />
        <button type='submit'>Create Post</button>
      </form>

      {post && (
        <div style={{marginTop: "20px"}}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          {post.image && (
            <img src={post.image} alt={post.title} style={{maxWidth: "100%"}} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
