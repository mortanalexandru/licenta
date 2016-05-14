System.register([], function (_export) {
  /**
   * Created by Alexandru on 14/03/16.
   */
  "use strict";

  var LOGIN_STATE, ROOM_STATE;
  return {
    setters: [],
    execute: function () {
      LOGIN_STATE = "login";
      ROOM_STATE = "room";

      _export("LOGIN_STATE", LOGIN_STATE);

      _export("ROOM_STATE", ROOM_STATE);
    }
  };
});
//# sourceMappingURL=../../sourcemaps/app/commons/componentConstants.js.map
