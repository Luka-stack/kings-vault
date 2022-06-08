export enum ActionType {
  // accounts
  LOG_IN = 'log_in',
  LOG_OUT = 'log_out',
  CREATE_USER = 'create_user',
  USER_FORM_COMPLETE = 'user_form_complete',
  USER_FORM_ERROR = 'user_form_error',
  USER_UPDATE = 'user_update',
  USER_ERROR = 'user_error',

  // passwords
  PASSWD_UPDATE_ALL = 'passwds_update_all',
  PASSWD_SAVE = 'passwds_save',
  PASSWD_DELETE = 'passwds_delete',

  // toasts
  APPEND_TOAST = 'append_toast',
  REMOVE_TOAST = 'remove_toast',
}
