import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  changeBackgroundChecking,
  changeBackgroundCheckInterval,
  changeDesktopNotifications,
} from "./actions";
import { savePrimitiveSetting } from "../utils";

const BackgroundSettings = () => {
  const settings = useSelector((state) => {
    return {
      background_checking: state.backgroundSettings.background_checking,
      background_checking_interval:
        state.backgroundSettings.background_checking_interval,
      desktop_notifications: state.backgroundSettings.desktop_notifications,
    };
  });

  const dispatch = useDispatch();

  return (
    <div className="backgroundSettings">
      <div className="option">
        <div className="optionName">Enable background checking</div>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.background_checking}
            onChange={async (e) => {
              dispatch(changeBackgroundChecking(e.target.checked));
              await savePrimitiveSetting(
                "background_checking",
                e.target.checked
              );
              if (!e.target.checked) {
                dispatch(changeDesktopNotifications(e.target.checked));
                savePrimitiveSetting("desktop_notifications", e.target.checked);
              }
            }}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="lines" />
      <div>
        <div className="option">
          <label htmlFor="checkInterval">
            Set background check interval in minutes (min. 10):{" "}
          </label>
          <input
            type="number"
            required
            min="5"
            max="999"
            disabled={!settings.background_checking}
            value={settings.background_checking_interval}
            onChange={(e) => {
              dispatch(changeBackgroundCheckInterval(Number(e.target.value)));
              savePrimitiveSetting(
                "background_checking_interval",
                Number(e.target.value)
              );
            }}
            name="checkInterval"
            className="checkInterval"
          ></input>
        </div>
      </div>
      <div className="lines" />
      <div className="option">
        <div className="optionName">Enable desktop notifications</div>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.desktop_notifications}
            onChange={(e) => {
              dispatch(changeDesktopNotifications(e.target.checked));
              savePrimitiveSetting("desktop_notifications", e.target.checked);
            }}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="lines" />
    </div>
  );
};

export default BackgroundSettings;
