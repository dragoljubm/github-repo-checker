import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  changeNewCommitColor,
  changePopupBackgroundColor,
  changeRepoPlaceholderColor,
  changeTextColor,
} from "./actions";
import { savePrimitiveSetting } from "../utils";

const ColorSettings = () => {
  const settings = useSelector((state) => {
    return {
      popup_background_color: state.colorSettings.popup_background_color,
      text_color: state.colorSettings.text_color,
      new_commit_color: state.colorSettings.new_commit_color,
      repo_placeholder_color: state.colorSettings.repo_placeholder_color,
    };
  });
  const dispatch = useDispatch();

  return (
    <div className="colorSettings">
      <div>
        <div className="option">
          <label htmlFor="popupBackgroundColor">Popup background color</label>
          <input
            type="color"
            id="popupBackgroundColor"
            name="popupBackgroundColor"
            value={settings.popup_background_color}
            onChange={(e) => {
              savePrimitiveSetting("popup_background_color", e.target.value);
              dispatch(changePopupBackgroundColor(e.target.value));
            }}
          />
        </div>
      </div>
      <div className="lines" />
      <div>
        <div className="option">
          <label htmlFor="textColor">Text color</label>
          <input
            type="color"
            id="textColor"
            name="textColor"
            value={settings.text_color}
            onChange={(e) => {
              dispatch(changeTextColor(e.target.value));
              savePrimitiveSetting("text_color", e.target.value);
            }}
          />
        </div>
      </div>
      <div className="lines" />
      <div>
        <div className="option">
          <label htmlFor="repoPlaceholderColor">Repository color</label>
          <input
            type="color"
            id="repoPlaceholderColor"
            name="repoPlaceholderColor"
            value={settings.repo_placeholder_color}
            onChange={(e) => {
              dispatch(changeRepoPlaceholderColor(e.target.value));
              savePrimitiveSetting("repo_placeholder_color", e.target.value);
            }}
          />
        </div>
      </div>
      <div className="lines" />
      <div>
        <div className="option">
          <label htmlFor="newCommitColor">New commit color</label>
          <input
            type="color"
            id="newCommitColor"
            name="newCommitColor"
            value={settings.new_commit_color}
            onChange={(e) => {
              dispatch(changeNewCommitColor(e.target.value));
              savePrimitiveSetting("new_commit_color", e.target.value);
            }}
          />
        </div>
      </div>
      <div className="lines" />
      <div
        className="preview-background"
        style={{ backgroundColor: settings.popup_background_color }}
      >
        <div
          className="preview"
          style={{ backgroundColor: settings.repo_placeholder_color }}
        >
          <div
            className="preview-notification"
            style={{ backgroundColor: settings.new_commit_color }}
          ></div>
          <div className="preview-alias" style={{ color: settings.text_color }}>
            Aa
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSettings;
