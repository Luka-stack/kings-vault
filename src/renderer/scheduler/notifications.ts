import { store } from '../state';
import Icon from '../../img/crown.png';

export const showNotification = (
  title: string,
  body: string,
  onClick?: () => void,
  onClose?: () => void
) => {
  const notification = new Notification(title, {
    body,
    icon: Icon,
  });

  if (onClick) notification.onclick = onClick;
  if (onClose) notification.onclick = onClose;
};

export const findNotifyOldPasswords = (onClick: () => void) => {
  const user = store.getState().users.user;
  const passwds = store.getState().passwds.passwds;

  if (user && passwds.length) {
    const maxModified = user.notifyDays * 24 * 60 * 60 * 1000;
    const oldPasswds = passwds.filter(
      (passwd) => Date.now() - new Date(passwd.modified).getTime() > maxModified
    );

    if (oldPasswds.length === 1) {
      showNotification(
        'New old password',
        `Password for ${oldPasswds[0].label} is getting old`,
        onClick
      );
    } else if (oldPasswds.length > 1) {
      showNotification(
        'New old passwords',
        `${oldPasswds.length} passwords are getting old`,
        onClick
      );
    }

    return;
  }
};
