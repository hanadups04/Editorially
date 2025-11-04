import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  createEditor,
  Transforms,
  Text,
  Editor,
  Element as SlateElement,
  Path,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  useSlateStatic,
  useSelected,
  useFocused,
  ReactEditor,
} from "slate-react";
import { HistoryEditor, withHistory } from "slate-history";
import {
  rtdb,
  set,
  rtdbRef,
  onValue,
  storage,
  onDisconnect,
  remove,
  update,
  get,
  db,
} from "../firebaseConfig";
import { doc as fsDoc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useLocation, useNavigate } from "react-router-dom";
import Moveable from "react-moveable";
import AddFunctions from "../context/functions/AddFunctions.js";
import "./PageTextEditor.css";
import { useAdminContext } from "../context/AdminContext.jsx";
import Offcanvas from "react-bootstrap/Offcanvas";
import ListGroup from "react-bootstrap/ListGroup";
import UpdateFunctions from "../context/functions/UpdateFunctions.js";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Docs from "../assets/images/Docs.png";
import History from "../assets/images/History.png";
import Export from "../assets/images/Export.png";
import DeleteB from "../assets/images/DeleteB.png";
import Bold from "../assets/images/Bold.png";
import Underline from "../assets/images/Underline.png";
import Italized from "../assets/images/Italic.png";
import AddImage from "../assets/images/AddImage.png";
import Undo from "../assets/images/Undo.png";
import Redo from "../assets/images/Redo.png";
import Proofread from "../assets/images/Proofread.png";
import Numbered from "../assets/images/Numbered.png";
import Bulleted from "../assets/images/Bulleted.png";
import CenterAlign from "../assets/images/CenterAlign.png";
import LeftAlign from "../assets/images/LeftAlign.png";
import RightALign from "../assets/images/RightAlign.png";
import Justify from "../assets/images/Justify.png";
import IncreaseIndent from "../assets/images/IncreaseIndent.png";
import DecreaseIndent from "../assets/images/DecreaseIndent.png";
import Menu from "../assets/images/Menu.png";
import * as Y from "yjs";
import { withYjs, YjsEditor } from "@slate-yjs/core";
import { startFirestoreSync } from "../context/yjsFsProvider.js";
import ChatPopOver from "../orgComponents/ChatPopOver.jsx";

const getTooltipText = (type) => {
  switch (type) {
    case 1:
      return "Undo";
    case 2:
      return "Redo";
    case 3:
      return "Proofread";
    case 4:
      return "Font";
    case 5:
      return "Font Size";
    case 6:
      return "Bold";
    case 7:
      return "Italic";
    case 8:
      return "Underline";
    case 9:
      return "Strike";
    case 10:
      return "Font Color";
    case 11:
      return "Highlight";
    case 12:
      return "Left Align";
    case 13:
      return "Center Align";
    case 14:
      return "Right Align";
    case 15:
      return "Justify";
    case 16:
      return "Bulleted List";
    case 17:
      return "Numbered List";
    case 18:
      return "Decrease Indent";
    case 19:
      return "Increase Indent";
    case 20:
      return "Version History";
    case 21:
      return "Upload Image";
    case 22:
      return user ? user.name : "User";
    case 23:
      return "Go Back";
    case 24:
      return "Save Changes";
    default:
      return "";
  }
};

const renderTooltip =
  (type, tooltipUser = null) =>
  (props) =>
    (
      <Tooltip id={`button-tooltip-${type}`} {...props}>
        {type === 22 && tooltipUser ? tooltipUser.name : getTooltipText(type)}
      </Tooltip>
    );

// --- Leaf renderer ---
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.strike) {
    children = <del>{children}</del>;
  }
  if (leaf.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>;
  }
  if (leaf.background) {
    children = (
      <span style={{ backgroundColor: leaf.background }}>{children}</span>
    );
  }
  if (leaf.font) {
    children = <span style={{ fontFamily: leaf.font }}>{children}</span>;
  }
  if (leaf.size) {
    children = <span style={{ fontSize: leaf.size }}>{children}</span>;
  }
  return <span {...attributes}>{children}</span>;
};

// --- Mark toggle helpers ---
const toggleMark = (editor, format, value = true) => {
  const isActive = isMarkActive(editor, format, value);
  Transforms.setNodes(
    editor,
    value && !isActive ? { [format]: value } : { [format]: null },
    { match: Text.isText, split: true }
  );
};

const isMarkActive = (editor, format, value = true) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[format] === value,
    universal: true,
  });
  return !!match;
};

// --- Toolbar Button ---
const ToolbarButton = ({ format, Icon, OverlayNum, value }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format, value ?? true);

  return (
    // <button
    //   style={{
    //     fontWeight: isActive ? "bold" : "normal",
    //     fontStyle: format === "italic" ? "italic" : "normal",
    //     textDecoration:
    //       format === "underline"
    //         ? "underline"
    //         : format === "strike"
    //         ? "line-through"
    //         : "none",
    //   }}
    //   onMouseDown={(event) => {
    //     event.preventDefault();
    //     toggleMark(editor, format, value ?? true);
    //   }}
    // >
    //   {icon}
    // </button>

    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={OverlayNum}
    >
      <img
        className="SlateToolbarIcon"
        src={Icon}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark(editor, format, value ?? true);
        }}
      />
    </OverlayTrigger>
  );
};

// --- Toolbar ---

const isBlockActive = (editor, format, blockProp = null) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === format &&
      (blockProp ? n[blockProp] === true : true),
  });
  return !!match;
};

//FOR TEXT ALIGNMENT
const LIST_TYPES = ["numbered-list", "bulleted-list"];

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type),
    split: true,
  });

  const newProperties = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format };
    Transforms.wrapNodes(editor, block);
  }
};

const BlockButton = ({ format, Icon, OverlayNum }) => {
  const editor = useSlate();
  const isActive = isBlockActive(editor, format);

  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={OverlayNum}
    >
      <img
        className="SlateToolbarIcon"
        src={Icon}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, format);
        }}
      />
    </OverlayTrigger>
  );
};

const toggleAlign = (editor, alignment) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.align === alignment,
  });
  Transforms.setNodes(
    editor,
    { align: match ? undefined : alignment },
    { match: (n) => SlateElement.isElement(n), split: true }
  );
};

const AlignButton = ({ alignment, Icon, OverlayNum }) => {
  const editor = useSlate();
  const isActive =
    isBlockActive(editor, "paragraph", "align") &&
    Editor.nodes(editor).some(([n]) => n.align === alignment);

  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={OverlayNum}
    >
      <img
        className="SlateToolbarIcon"
        src={Icon}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleAlign(editor, alignment);
        }}
      />
    </OverlayTrigger>
  );
};

//FOR UNDO REDO
const UndoButton = () => {
  const editor = useSlateStatic();
  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip(1)}
    >
      <img
        className="SlateToolbarIcon"
        src={Undo}
        onMouseDown={(event) => {
          event.preventDefault();
          if (editor.history.undos.length > 0) {
            HistoryEditor.undo(editor);
          }
        }}
      />
    </OverlayTrigger>
  );
};

const RedoButton = () => {
  const editor = useSlateStatic();
  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip(1)}
    >
      <img
        className="SlateToolbarIcon"
        src={Redo}
        onMouseDown={(event) => {
          event.preventDefault();
          if (editor.history.redos.length > 0) {
            HistoryEditor.redo(editor);
          }
        }}
      />
    </OverlayTrigger>
  );
};

//FOR INCREASE DECREASE
const increaseIndent = (editor) => {
  for (const [node, path] of Editor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
  })) {
    const currentIndent = node.indent || 0;
    Transforms.setNodes(editor, { indent: currentIndent + 1 }, { at: path });
  }
};

const decreaseIndent = (editor) => {
  for (const [node, path] of Editor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
  })) {
    const currentIndent = node.indent || 0;
    Transforms.setNodes(
      editor,
      { indent: Math.max(currentIndent - 1, 0) },
      { at: path }
    );
  }
};

//FOR IMAGE
const ImageElement = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const ref = useRef(null);

  const [selected, setSelected] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [frame, setFrame] = useState({
    translate: [element.x || 0, element.y || 0],
    width: element.width || 200,
    height: element.height || 200,
    rotate: element.rotate || 0,
  });

  return (
    <div
      {...attributes}
      contentEditable={false}
      style={{
        display: "inline-block",
        verticalAlign: "top",
        position: "relative",
        zIndex: 1,
        width: "100%",
        textAlign:
          element.align === "center"
            ? "center"
            : element.align === "right"
            ? "right"
            : "left", // <-- Add this
        maxWidth: "100%",
        overflow: "hidden",
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        setSelected(true);
      }}
    >
      <div
        ref={ref}
        style={{
          width: frame.width,
          height: frame.height,
          display: "inline-block",
          transform: `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`,
          margin:
            element.align === "center"
              ? "0 auto"
              : element.align === "right"
              ? "0 0 0 auto"
              : undefined,
          maxWidth: "100%",
        }}
      >
        <img
          src={element.url}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            float:
              element.wrap === "left"
                ? "left"
                : element.wrap === "right"
                ? "right"
                : "none",
            margin: "0 10px 10px 0",
            display: "block",
          }}
          // style={{
          //   width: `${frame.width}px`,
          //   height: `${frame.height}px`,
          //   float:
          //     element.wrap === "left"
          //       ? "left"
          //       : element.wrap === "right"
          //       ? "right"
          //       : "none",
          //   margin: "0 10px 10px 0",
          //   display: "block",
          //   maxWidth: "100%",
          //   marginLeft:
          //     element.align === "center"
          //       ? "auto"
          //       : element.align === "right"
          //       ? "auto"
          //       : undefined,
          //   marginRight:
          //     element.align === "center"
          //       ? "auto"
          //       : element.align === "right"
          //       ? "0"
          //       : undefined,
          // }}
        />
      </div>

      <Moveable
        target={selected ? ref : null}
        resizable={true}
        rotatable={true}
        throttleResize={0}
        throttleRotate={0}
        zIndex={-1}
        onResizeStart={({ setOrigin }) => {
          setOrigin(["50%", "50%"]);
        }}
        onResize={({ target, width, height }) => {
          target.style.width = `${Math.max(50, width)}px`;
          target.style.height = `${Math.max(50, height)}px`;
          setFrame((prev) => ({
            ...prev,
            width: Math.max(50, width),
            height: Math.max(50, height),
          }));
        }}
        onResizeEnd={() => {
          Transforms.setNodes(
            editor,
            { width: frame.width, height: frame.height },
            { at: path }
          );

          const nextPath = Editor.after(editor, path);
          if (nextPath) {
            const [nextNode] = Editor.node(editor, nextPath);
            if (!nextNode || nextNode.type !== "paragraph") {
              Transforms.insertNodes(
                editor,
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
                { at: Editor.after(editor, path) }
              );
            }
          }
        }}
        onRotateStart={({ setOrigin }) => {
          setOrigin(["50%", "50%"]);
        }}
        onRotate={({ target, beforeRotate }) => {
          target.style.transform = `rotate(${beforeRotate}deg)`;
          setFrame((prev) => ({
            ...prev,
            rotate: beforeRotate,
          }));
        }}
        onRotateEnd={() => {
          Transforms.setNodes(editor, { rotate: frame.rotate }, { at: path });
        }}
      />
      {children}
    </div>
  );
};

const insertImage = (editor, url, wrap = "left") => {
  const imageNode = {
    id: newNodeId(),

    type: "image",
    url,
    width: 200,
    height: 200,
    wrap,
    align: "center",
    x: 0,
    y: 0,
    rotate: 0,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, imageNode);
  Transforms.insertNodes(editor, {
    id: newNodeId(),

    type: "paragraph",
    align: "justify",
    children: [{ text: "" }],
  });
};

const withImages = (editor) => {
  const { isVoid, isInline } = editor;

  editor.isVoid = (element) =>
    element.type === "image" ? true : isVoid(element);
  editor.isInline = (element) => false;

  return editor;
};

// const ImageButton = () => {
//   const editor = useSlateStatic();

//   const onChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         insertImage(editor, reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div
//       {...attributes}
//       contentEditable={false}
//       style={{
//         display: "inline-block",
//         position: "relative",
//       }}
//       onClick={handleClick}
//     >
//       <img
//         ref={imgRef}
//         src={element.url}
//         alt=""
//         style={{
//           width: element.width || "auto",
//           height: element.height || "auto",

//           display: "block",
//           userSelect: "none",
//         }}
//         draggable={false}
//       />
//       {selected && focused && target && (
//         <Moveable
//           target={target}
//           resizable
//           draggable
//           keepRatio
//           onResize={(e) => {
//             e.target.style.width = `${e.width}px`;
//             e.target.style.height = `${e.height}px`;
//           }}
//           onResizeEnd={handleResizeEnd}
//           onDragStart={handleResizeStart}
//           onDrag={(e) => {
//             e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[]}px)`;

//           }}
//         />
//       )}
//       {children}
//     </div>
//   );
// };

const renderElement = (props) => {
  switch (props.element.type) {
    case "image":
      return <ImageElement {...props} />;
    default:
      return <Element {...props} />;
  }
};

const Element = ({ attributes, children, element }) => {
  const style = {
    textAlign: element.align || "left",
  };

  if (element.type === "paragraph") {
    style.paddingLeft = `${(element.indent || 0) * 20}px`;
  }

  if (element.type === "list-item") {
    style.paddingLeft = `${(element.indent || 0) * 20}px`; // maybe more for list-items
  }

  switch (element.type) {
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "paragraph":
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

//for export to html
const serializeToHTML = (node) => {
  if (Text.isText(node)) {
    let text = node.text;
    if (node.bold) text = `<strong>${text}</strong>`;
    if (node.italic) text = `<em>${text}</em>`;
    if (node.underline) text = `<u>${text}</u>`;
    if (node.strike) text = `<del>${text}</del>`;
    if (node.color) text = `<span style="color:${node.color}">${text}</span>`;
    if (node.background)
      text = `<span style="background-color:${node.background}">${text}</span>`;
    if (node.font)
      text = `<span style="font-family:${node.font}">${text}</span>`;
    if (node.size) text = `<span style="font-size:${node.size}">${text}</span>`;
    return text;
  }

  const children = node.children.map(serializeToHTML).join("");

  switch (node.type) {
    case "paragraph": {
      const indent = node.indent ? `padding-left:${node.indent * 20}px;` : "";
      const align = node.align ? `text-align:${node.align};` : "";
      return `<p style="${indent}${align}">${children}</p>`;
    }
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "bulleted-list":
      return `<ul>${children}</ul>`;
    case "list-item": {
      const indent = node.indent ? `padding-left:${node.indent * 20}px;` : "";
      return `<li style="${indent}">${children}</li>`;
    }
    case "code":
      return `<pre><code>${children}</code></pre>`;
    case "image": {
      const { url, width, height, x = 0, y = 0, rotate = 0, align } = node;
      let alignStyle = "display:inline-block;vertical-align:top;";
      if (align === "center") {
        alignStyle = "display:block;margin-left:auto;margin-right:auto;";
      } else if (align === "right") {
        alignStyle = "display:block;margin-left:auto;margin-right:0;";
      }
      return `<img 
        src="${url}" 
        style="
          width:${width}px;
          height:${height}px;
          transform:translate(${x}px,${y}px) rotate(${rotate}deg);
          ${alignStyle}
        "
      />`;
    }
    default:
      return children;
  }
};

const extractPlainText = (nodes) => {
  let text = "";
  nodes.forEach((node) => {
    if (node.type === "numbered-list") {
      text += "[NUMBERED-LIST]\n";
    } else if (node.type === "bulleted-list") {
      text += "[BULLETED-LIST]\n";
    } else if (node.type === "image") {
      text += "[IMAGE]\n";
    } else if (node.text !== undefined) {
      text += node.text;
    } else if (node.children) {
      text += extractPlainText(node.children);
    }
  });
  // console.log("extractPlainText result:", text, nodes);
  return text;
};

const newNodeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// Ensure every new element gets a unique id (on insert and split)
const withUniqueIds = (editor) => {
  const { apply, normalizeNode } = editor;

  editor.apply = (op) => {
    // Keep: ensure inserted elements get an id
    if (op.type === "insert_node" && SlateElement.isElement(op.node)) {
      if (!op.node.id) {
        op = { ...op, node: { ...op.node, id: newNodeId() } };
      }
    }

    apply(op);

    // After a split, assign a fresh id to the NEW right-side node
    if (op.type === "split_node" && SlateElement.isElement(op.properties)) {
      const newPath = Path.next(op.path);
      try {
        const [node] = Editor.node(editor, newPath);
        if (SlateElement.isElement(node)) {
          Transforms.setNodes(editor, { id: newNodeId() }, { at: newPath });
        }
      } catch {}
    }
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (SlateElement.isElement(node) && !node.id) {
      Transforms.setNodes(editor, { id: newNodeId() }, { at: path });
      return;
    }
    normalizeNode(entry);
  };

  return editor;
};

export default function PageTextEditor() {
  const {
    versionHistory,
    setVersionHistoryLTD,
    setSelectedTopic,
    handleProcessData,
    cleaned,
    currentUserData,
    setCurrentUserDataLTD,
    // urlQueryParams,
    // parentTopicID,
  } = useAdminContext();

  // urlQueryParams("parentTopic_ID", parentTopicID);
  // console.log("parentTopic_ID:", parentTopicID);

  // const ydocRef = useRef();

  const ydocRef = useRef(new Y.Doc());

  // const sharedType = useMemo(() => ydocRef.current.getText("content"), []);
  const sharedType = useMemo(
    () => ydocRef.current.get("content", Y.XmlText),
    []
  );

  const [editor] = useState(() => {
    const baseEditor = withReact(createEditor());
    const editorWithYjs = withYjs(baseEditor, sharedType);
    return withHistory(withImages(editorWithYjs));
  });

  useEffect(() => {
    const r = editor.sharedRoot;
    console.log("sharedRoot type:", r?.constructor?.name);
    // when inspecting text nodes:
    r?.toArray?.().forEach((child, i) => {
      console.log(i, child?.constructor?.name);
    });
  }, [editor]);

  useEffect(() => {
    // debug handlers — remove after debugging
    const docA = ydocRef.current; // the doc you created manually
    const docB = editor?.sharedRoot?.doc ?? null; // doc that slate-yjs might have created/attached

    console.log(
      "DEBUG: ydocRef.current === editor.sharedRoot?.doc ?",
      docA === docB
    );
    console.log("DEBUG: editor.sharedRoot:", editor.sharedRoot);

    // listen on both docs so we can see which one gets updates
    const hA = (update) =>
      console.log("DEBUG ydocRef.update (len):", update?.length, update);
    const hB = (update) =>
      console.log(
        "DEBUG editor.sharedRoot.doc.update (len):",
        update?.length,
        update
      );

    if (docA && docA.on) docA.on("update", hA);
    if (docB && docB.on) docB.on("update", hB);

    // instrument editor.apply to see Slate ops
    const origApply = editor.apply;
    editor.apply = (op) => {
      console.log("DEBUG editor.apply op:", op);

      return origApply(op);
    };

    return () => {
      if (docA && docA.off)
        try {
          docA.off("update", hA);
        } catch (e) {}
      if (docB && docB.off)
        try {
          docB.off("update", hB);
        } catch (e) {}
      editor.apply = origApply;
    };
  }, [editor]);

  // const yxml = useMemo(() => ydocRef.current.get("content", Y.XmlFragment), []);

  // const editor = useMemo(() => {
  //   const base = withReact(createEditor());

  //   const yEditor = withYjs(base, yxml);
  //   return withHistory(withImages(withUniqueIds(yEditor)));
  // }, [yxml]);

  // const [editor] = useState(() =>
  //   withHistory(withImages(withUniqueIds(withReact(createEditor()))))
  // );

  const [isLocalEdit, setIsLocalEdit] = useState(false);

  const initialValue = [
    {
      id: newNodeId(),

      type: "paragraph",
      align: "justify",
      children: [{ text: "" }],
    },
  ];

  const emptyValue = useMemo(
    () => [{ type: "paragraph", children: [{ text: "" }] }],
    []
  );

  const [value, setValue] = useState(editor.children);

  // const [slateKey, setSlateKey] = useState(0);
  // const isEditorFocusedRef = useRef(false);
  // const pendingRemoteValueRef = useRef(null);

  // console.log("Slate value", JSON.stringify(value, null, 2));

  const location = useLocation();
  const { projectId, subtaskId, isEditing = false } = location.state || {};

  useEffect(() => {
    // console.log("project id in slate is :", projectId);
    // console.log("subtask id in slate is :", subtaskId);

    setSelectedTopic(projectId);
  }, []);

  useEffect(() => {
    setVersionHistoryLTD(true);

    return () => {
      setVersionHistoryLTD(false);
    };
  }, [setVersionHistoryLTD]);

  useEffect(() => {
    setCurrentUserDataLTD(true);

    return () => {
      setCurrentUserDataLTD(false);
    };
  }, []);

  // const handleSaveHTMLToStorage = async (projectId) => {
  //   const html = value;
  //   const blob = new Blob([html], { type: "text/html" });

  //   const fileName = `document_${projectId}.html`;
  //   const projectRef = storageRef(
  //     storage,
  //     `projects/${projectId}/html/${fileName}`
  //   );

  //   try {
  //     await uploadBytes(projectRef, blob);
  //     const downloadURL = await getDownloadURL(projectRef);

  //     console.log("✅ html file uploaded:", downloadURL);
  //   } catch (error) {
  //     console.error("❌ html file upload failed", error);
  //   }
  // };

  const [isDiscon, setDiscon] = useState(false);

  const handleLoadVersion = (versionContent) => {
    if (!versionContent) return;

    // Enable preview mode
    setPreviewValue(versionContent);
    setPreviewMode(true);

    // Disconnect from Yjs so live updates don’t override preview
    if (!isDiscon) {
      YjsEditor.disconnect(editor);
    } else {
      console.log("is yjs connected?: ", isDiscon);
    }
    setDiscon(true);

    // Replace editor content with the version’s Slate JSON
    Editor.withoutNormalizing(editor, () => {
      editor.children = versionContent;
    });
    editor.onChange();

    // Reset history & focus
    Transforms.deselect(editor);
    editor.history = { undos: [], redos: [] };
    ReactEditor.focus(editor);
  };

  const handleResumeEditing = () => {
    setPreviewMode(false);
    setPreviewValue(null);
    setDiscon(false);

    // Restore live Yjs doc
    Editor.withoutNormalizing(editor, () => {
      editor.children = editor.sharedRoot.toJSON(); // sync back to live state
    });
    editor.onChange();

    YjsEditor.connect(editor);

    Transforms.deselect(editor);
    editor.history = { undos: [], redos: [] };
    ReactEditor.focus(editor);
  };

  const handleRestoreVersion = async (versionContent) => {
    if (!versionContent) return;

    if (previewMode || isDiscon) {
      YjsEditor.connect(editor);
      setDiscon(false);
    }

    Editor.withoutNormalizing(editor, () => {
      // remove all existing top-level nodes
      for (let i = editor.children.length - 1; i >= 0; i--) {
        Transforms.removeNodes(editor, { at: [i] });
      }
      // insert restored nodes
      if (Array.isArray(versionContent) && versionContent.length > 0) {
        Transforms.insertNodes(editor, versionContent, { at: [0] });
      } else {
        Transforms.insertNodes(
          editor,
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
          { at: [0] }
        );
      }
    });

    await updateRestoreVersion(projectId, versionContent);
    setPreviewMode(false);

    Transforms.deselect(editor);
    editor.history = { undos: [], redos: [] };
    ReactEditor.focus(editor);
  };

  // async function cleanSlateValue(getParagraphText, handleProcessData) {
  //   console.log("cleanSlateValue called with:", getParagraphText);
  //   async function processNode(node) {
  //     if (Text.isText(node)) {
  //       if (typeof node.text !== "string" || node.text.trim() === "") {
  //         return node;
  //       }
  //       const cleanedText = await handleProcessData(node.text);
  //       console.log("Processing text node:", node.text, "=>", cleanedText);
  //       return { ...node, text: cleanedText };
  //     }
  //     if (node.children) {
  //       const cleanedChildren = await Promise.all(
  //         node.children.map(processNode)
  //       );
  //       console.log(
  //         "Processing element node:",
  //         node.type || "unknown",
  //         cleanedChildren
  //       );
  //       return { ...node, children: cleanedChildren };
  //     }
  //     return node;
  //   }
  //   const result = await Promise.all(slateValue.map(processNode));
  //   console.log("cleanSlateValue result:", result);
  //   return result;
  // }

  const Toolbar = ({ value, setOpenProofreadModal }) => {
    const editor = useSlate();

    // const handleInsertImageFromUrl = () => {
    //   const url = window.prompt("Enter image URL");
    //   if (url) {
    //     insertImage(editor, url);
    //   }
    // };

    const fileInputRef = useRef(null);

    // Add click handler to trigger file input
    const triggerFileInput = () => {
      fileInputRef.current.click();
    };

    const handleInsertImageFromFile = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const id = `image_${Date.now()}`;

      try {
        const projectRef = storageRef(
          storage,
          `projects/${projectId}/images/${id}_${file.name}`
        );

        await uploadBytes(projectRef, file);

        const downloadURL = await getDownloadURL(projectRef);

        insertImage(editor, downloadURL);

        console.log("✅ Image uploaded:", downloadURL);
      } catch (error) {
        console.error("❌ Image upload failed", error);
      }
    };

    //save to local storage
    useEffect(() => {
      return () => {
        const html = value.map(serializeToHTML).join("");
        const wrappedHtml = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>body { font-family: Arial, sans-serif; }</style>
        </head>
        <body>${html}</body>
      </html>
    `;
        if (projectId) {
          const rawText = extractPlainText(value);
          localStorage.setItem(`html_${projectId}`, wrappedHtml);
          localStorage.setItem(`rawText`, rawText);
        }
      };
    }, [location, projectId, value]);

    return (
      <div className="ToolbarBtnsCont">
        {/* <button
          onMouseDown={(e) => {
            e.preventDefault();
            handleInsertImageFromUrl();
          }}
        >
          Insert Image (URL)
        </button> */}

        {/* Undo/Redo */}
        <UndoButton />
        <RedoButton />

        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip(3)}
        >
          <img
            className="SlateToolbarIcon"
            src={Proofread}
            onClick={async () => {
              // const paragraphText = getParagraphText(value);
              const paragraphText = getParagraphText(value).trim();
              if (!paragraphText) {
                alert("There is no text to proofread yet!");
                return;
              }

              // console.log("Extracted text:", paragraphText);
              // console.log("eto yung data", cleanSlateValue);
              const result = await handleProcessData(paragraphText); // wait for cleaned data
              // setCleanedSlateValue(result);
              // console.log("Cleaned result:", result);
              // if (result) {
              setContentData((prev) => ({
                ...prev,
                extracted: paragraphText,
                cleaned: result,
              })); // store it in formData
              // setHasProofread(true);
              setOpenProofreadModal(true); // then open modal
              // }
            }}
          />
        </OverlayTrigger>

        <div
          className="VerticalLineDiv"
          style={{
            height: "24px",
            width: "1px",
            backgroundColor: "#c7c7c7",
            margin: "0 10px",
            alignSelf: "center",
            display: "inline-flex",
            justifyContent: "center",
          }}
        />

        {/* Font Family */}
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip(4)}
        >
          <select
            className="ToolbarDropdownFont"
            defaultValue=""
            onChange={(e) => toggleMark(editor, "font", e.target.value || null)}
          >
            <option value="">Font</option>
            <option value="Arial">Arial</option>
            <option value="'Times New Roman'">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Calibri">Calibri</option>
            <option value="Georgia">Georgia</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Verdana">Verdana</option>
            <option value="Roboto">Roboto</option>
            {/* <option value="Roboto Mono">Roboto Mono</option>
          <option value="Roboto Serif">Roboto Serif</option>
          <option value="Roboto Slab">Roboto Slab</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Poppins">Poppins</option> */}
          </select>
        </OverlayTrigger>

        <div
          className="VerticalLineDiv"
          style={{
            height: "24px",
            width: "1px",
            backgroundColor: "#c7c7c7",
            margin: "0 10px",
            alignSelf: "center",
            display: "inline-flex",
            justifyContent: "center",
          }}
        />

        {/* Font Size gawing nakakatype ng size */}
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip(5)}
        >
          <select
            className="ToolbarDropdownFontSize"
            defaultValue=""
            onChange={(e) => toggleMark(editor, "size", e.target.value || null)}
          >
            {/* <option value="">Size</option> */}
            <option value="8px">8</option>
            <option value="9px">9</option>
            <option value="10px">10</option>
            <option value="11px">11</option>
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="20px">20</option>
            <option value="24px">24</option>
            <option value="30px">30</option>
            <option value="36px">36</option>
            <option value="48px">48</option>
            <option value="60px">60</option>
            <option value="72px">72</option>
            <option value="96px">97</option>
          </select>
        </OverlayTrigger>

        <div
          className="VerticalLineDiv"
          style={{
            height: "24px",
            width: "1px",
            backgroundColor: "#c7c7c7",
            margin: "0 10px",
            alignSelf: "center",
            display: "inline-flex",
            justifyContent: "center",
          }}
        />

        <ToolbarButton
          format="bold"
          Icon={Bold}
          OverlayNum={renderTooltip(6)}
        />
        <ToolbarButton
          format="italic"
          Icon={Italized}
          OverlayNum={renderTooltip(7)}
        />
        <ToolbarButton
          format="underline"
          Icon={Underline}
          OverlayNum={renderTooltip(8)}
        />
        <ToolbarButton
          format="strike"
          Icon={Bold}
          OverlayNum={renderTooltip(9)}
        />

        {/* Text Color */}
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip(10)}
        >
          <input
            type="color"
            value={Editor.marks(editor)?.color || "#000000"}
            onChange={(e) =>
              toggleMark(editor, "color", e.target.value || null)
            }
            style={{
              width: 32,
              height: 32,
              border: "none",
              background: "none",
            }}
          />
        </OverlayTrigger>
        {/* <button
          type="button"
          title="Clear text color"
          onClick={() => toggleMark(editor, "color", null)}
          style={{ marginLeft: 2 }}
        >
          ✕
        </button> */}

        {/* Highlight Color */}
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip(11)}
        >
          <input
            type="color"
            value={Editor.marks(editor)?.background || "#ffff00"}
            onChange={(e) =>
              toggleMark(editor, "background", e.target.value || null)
            }
            style={{
              width: 32,
              height: 32,
              border: "none",
              background: "none",
            }}
          />
        </OverlayTrigger>
        {/* <button
          type="button"
          title="Clear highlight"
          onClick={() => toggleMark(editor, "background", null)}
          style={{ marginLeft: 2 }}
        >
          ✕
        </button> */}

        <div
          className="VerticalLineDiv"
          style={{
            height: "24px",
            width: "1px",
            backgroundColor: "#c7c7c7",
            margin: "0 10px",
            alignSelf: "center",
            display: "inline-flex",
            justifyContent: "center",
          }}
        />

        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip(21)}
        >
          <img
            className="SlateToolbarIcon"
            src={AddImage}
            onClick={triggerFileInput}
          />
        </OverlayTrigger>

        <div
          className="VerticalLineDiv"
          style={{
            height: "24px",
            width: "1px",
            backgroundColor: "#c7c7c7",
            margin: "0 10px",
            alignSelf: "center",
            display: "inline-flex",
            justifyContent: "center",
          }}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleInsertImageFromFile}
        />

        {/* Blocks */}
        <BlockButton
          format="numbered-list"
          Icon={Bulleted}
          OverlayNum={renderTooltip(17)}
        />
        <BlockButton
          format="bulleted-list"
          Icon={Numbered}
          OverlayNum={renderTooltip(18)}
        />
        {/* <BlockButton format="code" icon="</>" Icon={Bulleted} OverlayNum={renderTooltip(17)}/> */}

        <div
          className="VerticalLineDiv"
          style={{
            height: "24px",
            width: "1px",
            backgroundColor: "#c7c7c7",
            margin: "0 10px",
            alignSelf: "center",
            display: "inline-flex",
            justifyContent: "center",
          }}
        />
        {/* Alignment */}
        <AlignButton
          alignment="left"
          icon="Left"
          Icon={LeftAlign}
          OverlayNum={renderTooltip(12)}
        />
        <AlignButton
          alignment="center"
          icon="Center"
          Icon={CenterAlign}
          OverlayNum={renderTooltip(13)}
        />
        <AlignButton
          alignment="right"
          icon="Right"
          Icon={RightALign}
          OverlayNum={renderTooltip(14)}
        />
        <AlignButton
          alignment="justify"
          icon="Justify"
          Icon={Justify}
          OverlayNum={renderTooltip(15)}
        />

        <div
          className="VerticalLineDiv"
          style={{
            height: "24px",
            width: "1px",
            backgroundColor: "#c7c7c7",
            margin: "0 10px",
            alignSelf: "center",
            display: "inline-flex",
            justifyContent: "center",
          }}
        />

        {/* Indent */}
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip(18)}
        >
          <img
            className="SlateToolbarIcon"
            src={DecreaseIndent}
            onMouseDown={(e) => {
              e.preventDefault();
              decreaseIndent(editor);
            }}
          />
        </OverlayTrigger>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip(19)}
        >
          <img
            className="SlateToolbarIcon"
            src={IncreaseIndent}
            onMouseDown={(e) => {
              e.preventDefault();
              increaseIndent(editor);
            }}
          />
        </OverlayTrigger>
      </div>
    );
  };

  // pagsave ng html sa storage
  const handleSaveHTMLToStorage = async () => {
    const html = value.map(serializeToHTML).join("");
    const wrappedHtml = `
              <html>
                <head>
                  <meta charset="UTF-8">
                  <style>body { font-family: Arial, sans-serif; }</style>
                </head>
                <body>${html}</body>
              </html>
            `;
    const blob = new Blob([wrappedHtml], { type: "text/html" });

    const fileName = `document_${projectId}.html`;
    const projectRef = storageRef(
      storage,
      `projects/${projectId}/html/${fileName}`
    );

    try {
      await uploadBytes(projectRef, blob);
      const downloadURL = await getDownloadURL(projectRef);

      console.log("✅ html file uploaded:", downloadURL);
    } catch (error) {
      console.error("❌ html file upload failed", error);
    }
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const { saveSlateVersion } = AddFunctions();
  const { updateRestoreVersion } = UpdateFunctions();
  const prevValueRef = useRef(value);
  const prevVersionValueRef = useRef(value);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewValue, setPreviewValue] = useState(null);
  const isApplyingRemoteRef = useRef(false);

  useEffect(() => {
    if (!projectId) return;
    const stop = startFirestoreSync({
      ydoc: ydocRef.current,
      db,
      docPath: ["tasks", projectId, "slateDoc", "slateDocumentID"],
      onReady: () => setIsLoaded(true),
    });

    return () => {
      setIsLoaded(false);
      try {
        stop();
      } catch (e) {
        console.error(
          "error in the start firestore sync in page text editer: ",
          e
        );
      }
    };
  }, [projectId]);

  useEffect(() => {
    if (!isLoaded) return;

    YjsEditor.connect(editor);
    return () => {
      YjsEditor.disconnect(editor);
    };
  }, [editor, isLoaded]);

  // useEffect(() => {
  //   if (!projectId) return;

  //   const textEditorRef = rtdbRef(rtdb, `projects/${projectId}/slateData`);

  //   const unsubscribe = onValue(textEditorRef, (snapshot) => {
  //     const data = snapshot.val();

  //     if (!data || !data.nodesById || !data.order) {
  //       // fallback to initial value
  //       setValue(initialValue);
  //       if (!isLoaded) {
  //         prevValueRef.current = initialValue;
  //         prevVersionValueRef.current = initialValue;
  //         setIsLoaded(true);
  //       }
  //       return;
  //     }

  //     const { nodesById, order } = data;

  //     // Reconstruct array for Slate
  //     const incomingVal = order.map((id) => nodesById[id]).filter(Boolean);
  //     const localVal = prevValueRef.current;

  //     // const newVal =
  //     //   data && data.value
  //     //     ? Array.isArray(data.value)
  //     //       ? data.value
  //     //       : [
  //     //           {
  //     //             id: `node_${Date.now()}`,
  //     //             type: "paragraph",
  //     //             align: "justify",
  //     //             children: [{ text: String(data.value) }],
  //     //           },
  //     //         ]
  //     //     : initialValue;
  //     // Only update if content is different
  //     // if (JSON.stringify(newVal) !== JSON.stringify(value)) {
  //     //   setValue(newVal);
  //     //   setSlateKey((k) => k + 1);
  //     // }
  //     //-----------------------------------
  //     // if (JSON.stringify(newVal) !== JSON.stringify(prevValueRef.current)) {
  //     //   // Apply to the Slate editor instance so UI updates without remounting
  //     //   isApplyingRemoteRef.current = true;
  //     //   Editor.withoutNormalizing(editor, () => {
  //     //     editor.children = newVal;
  //     //   });
  //     //   editor.onChange();
  //     //   setValue(newVal);
  //     //   prevValueRef.current = newVal;
  //     //   // Release the guard after onChange flushes
  //     //   Promise.resolve().then(() => {
  //     //     isApplyingRemoteRef.current = false;
  //     //   });
  //     // }
  //     // -------------------------------------------------

  //     // Build quick lookup maps
  //     const prevNodesById = {};
  //     localVal.forEach((n) => {
  //       if (n.id) prevNodesById[n.id] = n;
  //     });

  //     let mergedVal = [];

  //     // Merge step
  //     incomingVal.forEach((remoteNode, i) => {
  //       const localNode = prevNodesById[remoteNode.id];

  //       if (!localNode) {
  //         // New node from remote
  //         mergedVal.push(remoteNode);
  //         return;
  //       }

  //       // if (isNodeLockedLocally && isNodeLockedLocally(remoteNode.id)) {
  //       //   // Node is being edited locally → keep local version
  //       //   mergedVal.push(localNode);
  //       //   return;
  //       // }

  //       if (JSON.stringify(localNode) !== JSON.stringify(remoteNode)) {
  //         // Remote differs → take remote version
  //         mergedVal.push(remoteNode);
  //       } else {
  //         // Identical → keep local to avoid unnecessary re-render
  //         mergedVal.push(localNode);
  //       }
  //     });

  //     // Add any local-only nodes that are missing remotely
  //     localVal.forEach((localNode) => {
  //       if (!incomingVal.find((n) => n.id === localNode.id)) {
  //         mergedVal.push(localNode);
  //       }
  //     });

  //     // Apply to editor
  //     isApplyingRemoteRef.current = true;
  //     Editor.withoutNormalizing(editor, () => {
  //       newVal.forEach((node, i) => {
  //         const prevNode = prevNodesById[node.id];

  //         if (!prevNode) {
  //           Transforms.insertNodes(editor, node, { at: [i] });
  //           return;
  //         }

  //         if (JSON.stringify(prevNode) !== JSON.stringify(node)) {
  //           Transforms.setNodes(editor, node, { at: [i] });
  //         }
  //       });

  //       prevValueRef.current.forEach((prevNode, i) => {
  //         if (!newVal.find((n) => n.id === prevNode.id)) {
  //           Transforms.removeNodes(editor, { at: [i] });
  //         }
  //       });
  //     });
  //     editor.onChange();

  //     if (prevSelection) {
  //       try {
  //         Transforms.select(editor, prevSelection);
  //       } catch (e) {
  //         console.warn("Selection restore failed (node removed?):", e);
  //       }
  //     }

  //     Promise.resolve().then(() => {
  //       isApplyingRemoteRef.current = false;
  //     });

  //     if (!isLoaded) {
  //       console.log("new data has been loaded", mergedVal);
  //       setValue(mergedVal);
  //       prevValueRef.current = mergedVal;
  //       prevVersionValueRef.current = mergedVal;
  //       setIsLoaded(true);
  //     }
  //     // Sync React + refs

  //     //--------------------------------------------

  //     // if (JSON.stringify(newVal) !== JSON.stringify(prevValueRef.current)) {
  //     //   isApplyingRemoteRef.current = true;

  //     //   const prevNodesById = {};
  //     //   prevValueRef.current.forEach((n) => {
  //     //     prevNodesById[n.id] = n;
  //     //   });

  //     //   Editor.withoutNormalizing(editor, () => {
  //     //     newVal.forEach((node, i) => {
  //     //       const prevNode = prevNodesById[node.id];

  //     //       // node is new
  //     //       if (!prevNode) {
  //     //         Transforms.insertNodes(editor, node, { at: [i] });
  //     //         return;
  //     //       }

  //     //       // node changed
  //     //       if (JSON.stringify(prevNode) !== JSON.stringify(node)) {
  //     //         Transforms.setNodes(editor, node, { at: [i] });
  //     //       }
  //     //     });

  //     //     // remove deleted nodes
  //     //     prevValueRef.current.forEach((prevNode, i) => {
  //     //       if (!newVal.find((n) => n.id === prevNode.id)) {
  //     //         Transforms.removeNodes(editor, { at: [i] });
  //     //       }
  //     //     });
  //     //   });

  //     //   setValue(newVal);
  //     //   prevValueRef.current = newVal;

  //     //   Promise.resolve().then(() => {
  //     //     isApplyingRemoteRef.current = false;
  //     //   });
  //     // }

  //     // if (!isLoaded) {
  //     //   // Only set baseline once, at first load
  //     //   prevValueRef.current = newVal;
  //     //   prevVersionValueRef.current = newVal;
  //     //   setIsLoaded(true);
  //     // }
  //   });

  //   return () => unsubscribe();
  // }, [projectId, isLoaded, editor]);
  // ------------------------------------------
  // 1. Initial load effect (runs once)
  // useEffect(() => {
  //   if (!projectId || isLoaded) return;

  //   const textEditorRef = rtdbRef(rtdb, `projects/${projectId}/slateData`);

  //   get(textEditorRef).then((snapshot) => {
  //     const data = snapshot.val();
  //     if (!data || !data.nodesById || !data.order) {
  //       // Empty doc -> set initial
  //       setValue(initialValue);
  //       prevValueRef.current = initialValue;
  //       prevVersionValueRef.current = initialValue;
  //       setIsLoaded(true);
  //       return;
  //     }

  //     const { nodesById, order } = data;
  //     const incomingVal = order.map((id) => nodesById[id]).filter(Boolean);
  //     console.log("data from db is called onle here");

  //     isApplyingRemoteRef.current = true;
  //     Editor.withoutNormalizing(editor, () => {
  //       editor.children = incomingVal;
  //     });
  //     editor.onChange();

  //     setValue(incomingVal);
  //     prevValueRef.current = incomingVal;
  //     prevVersionValueRef.current = incomingVal;
  //     setIsLoaded(true);

  //     Promise.resolve().then(() => {
  //       isApplyingRemoteRef.current = false;
  //     });
  //   });
  // }, [projectId]);

  // // 2. Live updates effect (runs only after load)
  // useEffect(() => {
  //   if (!projectId || !isLoaded) return;

  //   const textEditorRef = rtdbRef(rtdb, `projects/${projectId}/slateData`);

  //   const unsubscribe = onValue(textEditorRef, (snapshot) => {
  //     const data = snapshot.val();
  //     if (!data || !data.nodesById || !data.order) return;

  //     const { nodesById, order } = data;
  //     const incomingVal = order.map((id) => nodesById[id]).filter(Boolean);
  //     const localVal = prevValueRef.current || [];

  //     // --- MERGE ---
  //     const prevNodesById = {};
  //     localVal.forEach((n) => {
  //       if (n?.id) prevNodesById[n.id] = n;
  //     });

  //     let mergedVal = [];
  //     incomingVal.forEach((remoteNode) => {
  //       console.log("mergedVal- merging is happening here:", mergedVal);
  //       const localNode = prevNodesById[remoteNode.id];
  //       if (!localNode) {
  //         mergedVal.push(remoteNode); // new node from remote
  //       } else if (JSON.stringify(localNode) !== JSON.stringify(remoteNode)) {
  //         mergedVal.push(remoteNode); // remote changed
  //       } else {
  //         mergedVal.push(localNode); // identical, reuse local reference
  //       }
  //     });

  //     // Add local-only nodes
  //     localVal.forEach((localNode) => {
  //       if (!incomingVal.find((n) => n.id === localNode.id)) {
  //         mergedVal.push(localNode);
  //       }
  //     });

  //     // --- APPLY TO SLATE ---
  //     const prevSelection = editor.selection;

  //     isApplyingRemoteRef.current = true;
  //     Editor.withoutNormalizing(editor, () => {
  //       editor.children = mergedVal;
  //     });
  //     editor.onChange();

  //     setValue(mergedVal);
  //     prevValueRef.current = mergedVal;

  //     if (prevSelection) {
  //       try {
  //         Transforms.select(editor, prevSelection);
  //       } catch (e) {
  //         console.warn("Failed to restore selection:", e);
  //       }
  //     }

  //     Promise.resolve().then(() => {
  //       isApplyingRemoteRef.current = false;
  //     });
  //   });

  //   return () => unsubscribe();
  // }, [projectId, isLoaded, editor]);

  //
  // const updateTextEditorData = (newValue) => {
  //   if (!projectId) return;

  //   // const nodesByIdRef = rtdbRef(
  //   //   rtdb,
  //   //   `projects/${projectId}/slateData/nodesById`
  //   // );
  //   const orderRef = rtdbRef(rtdb, `projects/${projectId}/slateData/order`);

  //   // Build a map of previous nodes by ID for comparison
  //   const prevNodesById = {};
  //   prevValueRef.current.forEach((node) => {
  //     if (node.id) prevNodesById[node.id] = node;
  //   });

  //   newValue.forEach((node) => {
  //     if (!node.id) return; // safety check
  //     const prevNode = prevNodesById[node.id];

  //     // Update node if it's new or changed
  //     if (!prevNode || JSON.stringify(prevNode) !== JSON.stringify(node)) {
  //       const nodeRef = rtdbRef(
  //         rtdb,
  //         `projects/${projectId}/slateData/nodesById/${node.id}`
  //       );
  //       update(nodeRef, { ...node });
  //     }
  //   });

  //   const newOrder = newValue.map((node) => node.id);
  //   set(orderRef, newOrder);

  //   prevValueRef.current = newValue;
  // };

  // useEffect(() => {
  //   if (!isLoaded || previewMode) return;

  //   const debounceTimeout = setTimeout(() => {
  //     if (JSON.stringify(prevValueRef.current) !== JSON.stringify(value)) {
  //       updateTextEditorData(value);
  //       prevValueRef.current = value;
  //     }
  //   }, 300);

  //   return () => clearTimeout(debounceTimeout);
  // }, [value, isLoaded]);

  //pag save sa firestore
  useEffect(() => {
    if (!isLoaded || previewMode || !isLocalEdit) return;

    const debounceTimeout = setTimeout(() => {
      if (
        JSON.stringify(prevVersionValueRef.current) !== JSON.stringify(value)
      ) {
        // console.log("Saving version to Firestore...");
        saveSlateVersion(projectId, value);
        prevVersionValueRef.current = value;
        setIsLocalEdit(false);
      } else {
        // console.log("No version change detected.");
      }
    }, 2000);

    return () => clearTimeout(debounceTimeout);
  }, [value, isLoaded, previewMode, isLocalEdit]);

  //for auto correct
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [openProofreadModal, setOpenProofreadModal] = useState(false);
  const [contentData, setContentData] = useState(null);

  const handleProofreadInputChange = (e) => {
    const { name, value } = e.target;
    setContentData((prev) => ({ ...prev, [name]: value }));
    // console.log("value", value);
  };

  const getParagraphText = (slateValue) => {
    let paragCount = 0;
    const result = slateValue
      .map((node) => {
        if (node.type === "paragraph" || node.type === "PARAGRAPH") {
          const text = extractPlainText(node.children).trim();

          // console.log("plaintext daw", text);
          if (text) {
            paragCount += 1;
            return `[Paragraph ${paragCount}]\n${text}`;
          }
          return "";
        } else if (node.type === "numbered-list") {
          return "[NUMBERED-LIST]";
        } else if (node.type === "bulleted-list") {
          return "[BULLETED-LIST]";
        } else if (node.type === "image") {
          return "[IMAGE]";
        }
        return "";
      })
      .join("\n");
    // console.log("getParagraphText result:", result);
    return result;
  };

  // const [cleanedSlateValue, setCleanedSlateValue] = useState(null);

  const [activeUsers, setActiveUsers] = useState([]);

  const generateUserColor = (userId) => {
    const colors = [
      "#e95b3cff",
      "#40ac54ff",
      "#36409bff",
      "#FF33A1",
      "#6b478aff",
      "#33FFF5",
      "#F5FF33",
      "#020B40",
      "#c94ca3ff",
      "#7c5771ff",
    ];
    const index = userId ? userId.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  useEffect(() => {
    if (
      !currentUserData ||
      !projectId ||
      !currentUserData.id ||
      !currentUserData.name
    )
      return;

    const userRef = rtdbRef(
      rtdb,
      `projects/${projectId}/activeUsers/${currentUserData.id}`
    );

    const userColor = generateUserColor(currentUserData.id);

    set(userRef, {
      id: currentUserData.id,
      name: currentUserData.name,
      color: userColor,
      timestamp: Date.now(),
    });

    onDisconnect(userRef).remove();

    const activeUsersRef = rtdbRef(rtdb, `projects/${projectId}/activeUsers`);
    const unsubscribe = onValue(activeUsersRef, (snapshot) => {
      const users = snapshot.val() || {};
      setActiveUsers(Object.values(users));
    });

    return () => {
      remove(userRef);
      unsubscribe();
    };
  }, [currentUserData, projectId]);

  //tooltip
  const [showToolbarOffCanvas, setShowToolbarOffCanvas] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <div className="PageTextEditor-Parent">
        <div className="PageTextEditor-Child">
          <div
            className="PageTextEditor-Navbar"
            style={{ display: "flex", width: "100%", height: "100px" }}
          >
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip(23)}
            >
              <img
                className="DocsIcon"
                src={Docs}
                onClick={() => navigate(-1)}
              />
            </OverlayTrigger>
            <div className="PageTextEditor-NavbarTitle">
              <p className="p1">EDITORIALLY DOCS</p>
              <p className="p2">Text Editor</p>
            </div>

            <div className="PageTextEditor-NavbarButtons">
              {activeUsers.map((user) => (
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip(22, user)}
                >
                  <div
                    className="ActiveUserAvatar"
                    key={user.id}
                    style={{ backgroundColor: user.color || "gray" }}
                  >
                    <p> {user.name?.[0] || ""}</p>
                  </div>
                </OverlayTrigger>
              ))}
              {/* dito yung save btn */}
              {isEditing && (
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip(24)}
                >
                  <img
                    className="SlateToolbarIcon"
                    src={Export}
                    onClick={() => handleSaveHTMLToStorage()}
                  />
                </OverlayTrigger>
              )}

              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip(20)}
              >
                <img
                  className="SlateToolbarIcon"
                  src={History}
                  onClick={handleShow}
                />
              </OverlayTrigger>
            </div>
          </div>

          <div className="PageTextEditor-Body">
            {isLoaded && (
              <>
                <Slate
                  // key={slateKey}
                  editor={editor}
                  initialValue={
                    previewMode && previewValue ? previewValue : emptyValue
                  }
                  onChange={(newValue) => {
                    // if (previewMode) return;
                    if (previewMode || isApplyingRemoteRef.current) return;

                    // Ensure every block node has a unique ID
                    const valueWithIds = newValue.map((node) => {
                      if (!node.id) {
                        return {
                          ...node,
                          id: newNodeId(),
                        };
                      }
                      return node;
                    });

                    if (valueWithIds.length === 0) {
                      Transforms.insertNodes(editor, {
                        id: newNodeId(),

                        type: "paragraph",
                        children: [{ text: "" }],
                      });
                    } else {
                      setIsLocalEdit(true);
                      setValue(valueWithIds);
                    }
                  }}
                >
                  <div className="PageTextEditor-ToolbarCont">
                    {previewMode && (
                      <div style={{ marginBottom: 8, color: "orange" }}>
                        <button
                          onClick={() => {
                            handleResumeEditing();
                            handleClose(true);
                          }}
                          style={{ marginLeft: 12 }}
                        >
                          Resume Editing Latest
                        </button>
                        <b style={{ marginLeft: 12 }}>
                          Previewing a previous version.
                        </b>

                        <button
                          onClick={async () => {
                            handleRestoreVersion(selectedVersion.content);
                            handleClose(true);

                            // if (selectedVersion) {
                            //   await updateRestoreVersion(
                            //     projectId,
                            //     selectedVersion.content
                            //   );
                            //   setPreviewMode(false);

                            //   setValue(selectedVersion.content);

                            //   // setValue(selectedVersion.content);

                            //   // setSlateKey((k) => k + 1);
                            //   // Apply restored content into editor so it shows immediately
                            //   const doc = selectedVersion.content;
                            //   Editor.withoutNormalizing(editor, () => {
                            //     editor.children = doc;
                            //   });
                            //   editor.onChange();
                            //   setValue(doc);
                            //   prevValueRef.current = doc;
                            //   // setSlateKey((k) => k + 1);
                            // }
                          }}
                          style={{ marginLeft: 12 }}
                        >
                          Restore This Version
                        </button>
                      </div>
                    )}
                    <div className="PageTextEditor-Toolbar">
                      <img
                        className="MenuToolbarIcon"
                        src={Menu}
                        onClick={() => setShowToolbarOffCanvas(true)}
                      />
                      <Toolbar
                        className="ToolBar"
                        value={
                          previewMode && previewValue ? previewValue : value
                        }
                        setOpenProofreadModal={setOpenProofreadModal}
                      />

                      {showToolbarOffCanvas && (
                        <Offcanvas
                          className="OffcanvasToolbar-Parent"
                          show={showToolbarOffCanvas}
                          onHide={() => setShowToolbarOffCanvas(false)}
                          scroll={true}
                          backdrop={false}
                          placement={"start"}
                        >
                          <Offcanvas.Header closeButton>
                            <Offcanvas.Title>
                              <p className="OffcanvasTitle">TOOLBAR</p>
                            </Offcanvas.Title>
                          </Offcanvas.Header>
                          <Offcanvas.Body>
                            <div className="OffcanvasToolbar-Body">
                              <Toolbar
                                className="ToolBar"
                                value={
                                  previewMode && previewValue
                                    ? previewValue
                                    : value
                                }
                                setOpenProofreadModal={setOpenProofreadModal}
                              />
                            </div>
                          </Offcanvas.Body>
                        </Offcanvas>
                      )}
                    </div>
                  </div>

                  <div
                    className={`PageTextEditor-SlateNPreview ${
                      openProofreadModal ? "withPreview" : ""
                    }`}
                  >
                    <div className="PageTextEditor-Slate">
                      <Editable
                        className="PageTextEditor-SlateCont"
                        // placeholder="Enter some text..."
                        readOnly={previewMode}
                        style={{ minHeight: "1200px" }}
                        renderElement={renderElement}
                        renderLeaf={(props) => <Leaf {...props} />}
                        onKeyDown={(event) => {
                          if (previewMode) {
                            event.preventDefault();
                            return;
                          }

                          if (event.key === "Enter") {
                            event.preventDefault();

                            // Split only blocks
                            Transforms.splitNodes(editor, {
                              match: (n) =>
                                SlateElement.isElement(n) &&
                                Editor.isBlock(editor, n),
                              always: true,
                            });

                            // Set a fresh id on the NEW block (not the text leaf)
                            const { selection } = editor;
                            if (selection) {
                              const [entry] = Editor.nodes(editor, {
                                at: selection,
                                match: (n) =>
                                  SlateElement.isElement(n) &&
                                  Editor.isBlock(editor, n),
                              });
                              if (entry) {
                                const [, path] = entry;
                                Transforms.setNodes(
                                  editor,
                                  { id: newNodeId() },
                                  { at: path }
                                );
                              }
                            }
                            return;
                          }

                          if (!event.ctrlKey) {
                            return;
                          }
                          switch (event.key) {
                            case "`": {
                              event.preventDefault();
                              const [match] = Editor.nodes(editor, {
                                match: (n) => n.type === "code",
                              });
                              Transforms.setNodes(
                                editor,
                                { type: match ? null : "code" },
                                {
                                  match: (n) =>
                                    Element.isElement(n) &&
                                    Editor.isBlock(editor, n),
                                }
                              );
                              break;
                            }
                            case "b": {
                              event.preventDefault();
                              Editor.addMark(editor, "bold", true);
                              break;
                            }
                            case "i": {
                              event.preventDefault();
                              Editor.addMark(editor, "italic", true);
                              break;
                            }
                            case "u": {
                              event.preventDefault();
                              Editor.addMark(editor, "underline", true);
                              break;
                            }
                          }
                        }}
                      />
                    </div>
                    {openProofreadModal && (
                      <div className="PageTextEditor-PreviewCont">
                        <p className="ProofReadTitle">PROOFREAD PREVIEW</p>
                        <div className="ProofReadContent">
                          <pre
                            style={{
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                            }}
                          >
                            {cleaned}
                          </pre>
                        </div>
                        <div className="ProofreadBtns">
                          <button
                            className="Cancel"
                            type="button"
                            onClick={() => setOpenProofreadModal(false)}
                          >
                            Hide
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Slate>
              </>
            )}
          </div>
        </div>

        {/* off canvas for version history */}
        <Offcanvas
          show={show}
          onHide={handleClose}
          scroll={true}
          backdrop={false}
          placement={"end"}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Version History</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {versionHistory && versionHistory.length > 0 ? (
              versionHistory.map((version, idx) => (
                <ListGroup>
                  <ListGroup.Item
                    key={version.id || idx}
                    onClick={() => {
                      setSelectedVersion(version);
                      handleLoadVersion(version.content);
                    }}
                  >
                    Version {idx + 1} <br />
                    {version.versionDate && ` ${version.versionDate}`}
                    <br />
                    {version.author && ` ${version.author}`}
                  </ListGroup.Item>
                </ListGroup>
              ))
            ) : (
              <ListGroup>
                <ListGroup.Item>No versions</ListGroup.Item>
              </ListGroup>
            )}
          </Offcanvas.Body>
        </Offcanvas>
        <ChatPopOver />
      </div>
    </>
  );
}
