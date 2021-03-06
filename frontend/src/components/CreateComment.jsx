import { useHistory } from "react-router-dom";
import { Fetch } from "../utils/fetch";
import pcss from "../styles/post.module.css";

export const CreateComment = (props) => {
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(e.target[0].value.trim().length===0){
      e.target[0].value=""
      return
    }
    e.target[0].value =e.target[0].value.trim()
    let obj = {
      postId: props.postId,
      userId: props.currentUser.id,
      text: e.target[0].value,
    };

    let res = await Fetch("rest/comment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(obj),
    });
    if (!res) {
      console.log("POST comment failed");
      return;
    } else {
      let tempComment = props.test.comments;
      let tempObj = {
        postId: res.postId,
        text: res.text,
        commentUsername: props.currentUser.username,
      };
      tempComment.push(tempObj);
      props.post((p) => ({ ...p, comments: tempComment }));
      props.render(p => !p)

    }
    e.target.reset()
  };

  const handleBold = () => {
    let textArea = document.getElementById("commentInput");
    if (textArea.selectionStart == textArea.selectionEnd) return;
    while (textArea.value.substr(textArea.selectionEnd - 1, 1) == " ") {
      textArea.selectionEnd = textArea.selectionEnd - 1;
    }
    let selected = textArea.value.slice(
      textArea.selectionStart,
      textArea.selectionEnd
    );

    textArea.setRangeText(`*${selected}*`);
  };
  const handleItalic = () => {
    let textArea = document.getElementById("commentInput");
    if (textArea.selectionStart == textArea.selectionEnd) return;
    while (textArea.value.substr(textArea.selectionEnd - 1, 1) == " ") {
      textArea.selectionEnd = textArea.selectionEnd - 1;
    }
    let selected = textArea.value.slice(
      textArea.selectionStart,
      textArea.selectionEnd
    );

    textArea.setRangeText(`**${selected}**`);
  };

  const handleCode = () => {
    let textArea = document.getElementById("commentInput");
    if (textArea.selectionStart == textArea.selectionEnd) return;
    while (textArea.value.substr(textArea.selectionEnd - 1, 1) == " ") {
      textArea.selectionEnd = textArea.selectionEnd - 1;
    }
    let selected = textArea.value.slice(
      textArea.selectionStart,
      textArea.selectionEnd
    );

    textArea.setRangeText(`\`\`\`${selected}\`\`\``);
  };

  return (
    <div className={pcss.createComment}>
      {props.currentUser.id ? (
        <div>
          <form className={pcss.form} onSubmit={handleSubmit}>
            <textarea
              className={pcss.textAreaComment}
              placeholder="Write a comment here..."
              id="commentInput"
              type="text"
              required
            />
            <div className={pcss.writeCommentBar}>
              <div>
                <button onClick={handleBold} type="button">
                  <b>B</b>
                </button>
                <button onClick={handleItalic} type="button">
                  <i>T</i>
                </button>
                <button onClick={handleCode} type="button">{`< >`}</button>
              </div>
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      ) : (
        <button onClick={() => history.push("/login")}>Log in to comment on this post</button>
      )}
    </div>
  );
};
