const Cell = ({details, onUpdateFlag, onRevealCell}) => {
    const cellStyle = {
        width: 40, height: 40, background: "lightgrey",
        borderWidth: 3, borderStyle: "outset", display: 'flex',
        justifyContent: "center", alignItems: "center", cursor: "pointer"
    }
    const getCellDisplay = () => {
        if(!details.revealed){return details.flagged ? '🚩' : null;}
        if(details.value === 'X'){return '💣';}
        if(details.value === 0){return null;}
        return details.value;
    }
    return(
        //{/*<div style={cellStyle}*/}
        <div style={details.revealed ? { ...cellStyle, borderStyle: 'inset' } : { ...cellStyle, borderStyle: 'outset' }}
        onContextMenu={(e) => {
            e.preventDefault(); // 右クリックのデフォルトメニューを防ぐ
            onUpdateFlag(e);}}
            onClick={onRevealCell}>
            {getCellDisplay()}
        </div>
    );
}
export default Cell;