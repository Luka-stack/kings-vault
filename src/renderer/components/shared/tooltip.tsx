import Popup from 'reactjs-popup';

type PopupPosition =
  | 'top left'
  | 'top center'
  | 'top right'
  | 'right top'
  | 'right center'
  | 'right bottom'
  | 'bottom left'
  | 'bottom center'
  | 'bottom right'
  | 'left top'
  | 'left center'
  | 'left bottom'
  | 'center center';

interface Props {
  id?: string;
  position: PopupPosition;
  text: string;
}

const Tooltip: React.FC<Props> = ({ id, position, text, children }) => {
  return (
    <Popup
      key={id}
      position={position}
      on={['hover']}
      closeOnDocumentClick
      trigger={children as JSX.Element}
    >
      {text}
    </Popup>
  );
};

export default Tooltip;
