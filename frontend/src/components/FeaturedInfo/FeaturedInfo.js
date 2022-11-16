import '../../assets/CSS/Dashboard.css';
import {FeaturedInfoData} from './FeaturedInfoData';

function FeaturedInfo() {
    return (
    <div className="featured">
      <ul className="featuredItem">
        <div className="featuredTitle">Session Overview</div>
          <div className="featuredContainer">
            {FeaturedInfoData.map((val , key) => {
              return (
                <li key={key} className="row "> 
                  <div id="icon">
                    {val.icon}
                    {val.title}
                  </div>
                </li>
              );
           })}
        </div>
      </ul>
    </div>
    );
}

export default FeaturedInfo;
