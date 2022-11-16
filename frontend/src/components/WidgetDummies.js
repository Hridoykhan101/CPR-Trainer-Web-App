import "../assets/CSS/Dashboard.css";

const WidgetDummies = (props) => {
    return(
    <div className="widgetLg">
        <h3 className="widgetLgTitle">Mannequins</h3>
        <table className="widgetLgTable">
            <thead>
                <tr className="widgetLgTr">
                    <th className="widgetLgTh">QR Code</th>
                    <th className="widgetLgTh">Name</th>
                </tr>
            </thead>
            <tbody>
                {(props.dummyData ? props.dummyData.map((data, ind) => {
                    return(
                    <tr className="widgetLgTrTable" key={ind}>
                        <td className="widgetLgTh">{data.qrCode}</td>
                        <td className="widgetLgTh">{data.name}</td>
                    </tr>
                    );
                }) : null)}
            </tbody>
        </table>
    </div>
    )
}

export default WidgetDummies;