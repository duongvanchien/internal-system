import HouseRoundedIcon from '@mui/icons-material/HouseRounded';
import SupervisedUserCircleRoundedIcon from '@mui/icons-material/SupervisedUserCircleRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';

export const DashBoardScreen = () => {
    return (
        <section className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="info-box">
                            <span className="info-box-icon bg-info elevation-1">
                                <HouseRoundedIcon />
                            </span>
                            <div className="info-box-content">
                                <span className="info-box-text">Phòng ban</span>
                                <span className="info-box-number">
                                    5
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="info-box mb-3">
                            <span className="info-box-icon bg-danger elevation-1">
                                <SupervisedUserCircleRoundedIcon />
                            </span>
                            <div className="info-box-content">
                                <span className="info-box-text">Nhân viên</span>
                                <span className="info-box-number">41,410</span>
                            </div>
                        </div>
                    </div>
                    <div className="clearfix hidden-md-up" />
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="info-box mb-3">
                            <span className="info-box-icon bg-success elevation-1">
                                <EmojiEventsRoundedIcon />
                            </span>
                            <div className="info-box-content">
                                <span className="info-box-text">Sự kiện</span>
                                <span className="info-box-number">760</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="info-box mb-3">
                            <span className="info-box-icon bg-warning elevation-1">
                                <EmailRoundedIcon />
                            </span>
                            <div className="info-box-content">
                                <span className="info-box-text">Đơn</span>
                                <span className="info-box-number">2,000</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Monthly Recap Report</h5>
                                <div className="card-tools">
                                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                        <i className="fas fa-minus" />
                                    </button>
                                    <div className="btn-group">
                                        <button type="button" className="btn btn-tool dropdown-toggle" data-toggle="dropdown">
                                            <i className="fas fa-wrench" />
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-right" role="menu">
                                            <a href="#" className="dropdown-item">Action</a>
                                            <a href="#" className="dropdown-item">Another action</a>
                                            <a href="#" className="dropdown-item">Something else here</a>
                                            <a className="dropdown-divider" />
                                            <a href="#" className="dropdown-item">Separated link</a>
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-tool" data-card-widget="remove">
                                        <i className="fas fa-times" />
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <p className="text-center">
                                            <strong>Sales: 1 Jan, 2014 - 30 Jul, 2014</strong>
                                        </p>
                                        <div className="chart"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div /></div><div className="chartjs-size-monitor-shrink"><div /></div></div>
                                            <canvas id="salesChart" height={180} style={{ height: 180, display: 'block', width: 836 }} width={836} className="chartjs-render-monitor" />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <p className="text-center">
                                            <strong>Goal Completion</strong>
                                        </p>
                                        <div className="progress-group">
                                            Add Products to Cart
                                            <span className="float-right"><b>160</b>/200</span>
                                            <div className="progress progress-sm">
                                                <div className="progress-bar bg-primary" style={{ width: '80%' }} />
                                            </div>
                                        </div>
                                        <div className="progress-group">
                                            Complete Purchase
                                            <span className="float-right"><b>310</b>/400</span>
                                            <div className="progress progress-sm">
                                                <div className="progress-bar bg-danger" style={{ width: '75%' }} />
                                            </div>
                                        </div>
                                        <div className="progress-group">
                                            <span className="progress-text">Visit Premium Page</span>
                                            <span className="float-right"><b>480</b>/800</span>
                                            <div className="progress progress-sm">
                                                <div className="progress-bar bg-success" style={{ width: '60%' }} />
                                            </div>
                                        </div>
                                        <div className="progress-group">
                                            Send Inquiries
                                            <span className="float-right"><b>250</b>/500</span>
                                            <div className="progress progress-sm">
                                                <div className="progress-bar bg-warning" style={{ width: '50%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="row">
                                    <div className="col-sm-3 col-6">
                                        <div className="description-block border-right">
                                            <span className="description-percentage text-success"><i className="fas fa-caret-up" /> 17%</span>
                                            <h5 className="description-header">$35,210.43</h5>
                                            <span className="description-text">TOTAL REVENUE</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-3 col-6">
                                        <div className="description-block border-right">
                                            <span className="description-percentage text-warning"><i className="fas fa-caret-left" /> 0%</span>
                                            <h5 className="description-header">$10,390.90</h5>
                                            <span className="description-text">TOTAL COST</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-3 col-6">
                                        <div className="description-block border-right">
                                            <span className="description-percentage text-success"><i className="fas fa-caret-up" /> 20%</span>
                                            <h5 className="description-header">$24,813.53</h5>
                                            <span className="description-text">TOTAL PROFIT</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-3 col-6">
                                        <div className="description-block">
                                            <span className="description-percentage text-danger"><i className="fas fa-caret-down" /> 18%</span>
                                            <h5 className="description-header">1200</h5>
                                            <span className="description-text">GOAL COMPLETIONS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Latest Members</h3>
                                <div className="card-tools">
                                    <span className="badge badge-danger">8 New Members</span>
                                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                        <i className="fas fa-minus" />
                                    </button>
                                    <button type="button" className="btn btn-tool" data-card-widget="remove">
                                        <i className="fas fa-times" />
                                    </button>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <ul className="users-list clearfix">
                                    <li>
                                        <img src="dist/img/user1-128x128.jpg" alt="User Image" />
                                        <a className="users-list-name" href="#">Alexander Pierce</a>
                                        <span className="users-list-date">Today</span>
                                    </li>
                                    <li>
                                        <img src="dist/img/user8-128x128.jpg" alt="User Image" />
                                        <a className="users-list-name" href="#">Norman</a>
                                        <span className="users-list-date">Yesterday</span>
                                    </li>
                                    <li>
                                        <img src="dist/img/user7-128x128.jpg" alt="User Image" />
                                        <a className="users-list-name" href="#">Jane</a>
                                        <span className="users-list-date">12 Jan</span>
                                    </li>
                                    <li>
                                        <img src="dist/img/user6-128x128.jpg" alt="User Image" />
                                        <a className="users-list-name" href="#">John</a>
                                        <span className="users-list-date">12 Jan</span>
                                    </li>
                                    <li>
                                        <img src="dist/img/user2-160x160.jpg" alt="User Image" />
                                        <a className="users-list-name" href="#">Alexander</a>
                                        <span className="users-list-date">13 Jan</span>
                                    </li>
                                    <li>
                                        <img src="dist/img/user5-128x128.jpg" alt="User Image" />
                                        <a className="users-list-name" href="#">Sarah</a>
                                        <span className="users-list-date">14 Jan</span>
                                    </li>
                                    <li>
                                        <img src="dist/img/user4-128x128.jpg" alt="User Image" />
                                        <a className="users-list-name" href="#">Nora</a>
                                        <span className="users-list-date">15 Jan</span>
                                    </li>
                                    <li>
                                        <img src="dist/img/user3-128x128.jpg" alt="User Image" />
                                        <a className="users-list-name" href="#">Nadia</a>
                                        <span className="users-list-date">15 Jan</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-footer text-center">
                                <a href="javascript:">View All Users</a>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header border-transparent">
                                <h3 className="card-title">Latest Orders</h3>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table m-0">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Item</th>
                                                <th>Status</th>
                                                <th>Popularity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><a href="pages/examples/invoice.html">OR9842</a></td>
                                                <td>Call of Duty IV</td>
                                                <td><span className="badge badge-success">Shipped</span></td>
                                                <td>
                                                    <div className="sparkbar" data-color="#00a65a" data-height={20}>90,80,90,-70,61,-83,63</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="pages/examples/invoice.html">OR1848</a></td>
                                                <td>Samsung Smart TV</td>
                                                <td><span className="badge badge-warning">Pending</span></td>
                                                <td>
                                                    <div className="sparkbar" data-color="#f39c12" data-height={20}>90,80,-90,70,61,-83,68</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="pages/examples/invoice.html">OR7429</a></td>
                                                <td>iPhone 6 Plus</td>
                                                <td><span className="badge badge-danger">Delivered</span></td>
                                                <td>
                                                    <div className="sparkbar" data-color="#f56954" data-height={20}>90,-80,90,70,-61,83,63</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="pages/examples/invoice.html">OR7429</a></td>
                                                <td>Samsung Smart TV</td>
                                                <td><span className="badge badge-info">Processing</span></td>
                                                <td>
                                                    <div className="sparkbar" data-color="#00c0ef" data-height={20}>90,80,-90,70,-61,83,63</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="pages/examples/invoice.html">OR1848</a></td>
                                                <td>Samsung Smart TV</td>
                                                <td><span className="badge badge-warning">Pending</span></td>
                                                <td>
                                                    <div className="sparkbar" data-color="#f39c12" data-height={20}>90,80,-90,70,61,-83,68</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="pages/examples/invoice.html">OR7429</a></td>
                                                <td>iPhone 6 Plus</td>
                                                <td><span className="badge badge-danger">Delivered</span></td>
                                                <td>
                                                    <div className="sparkbar" data-color="#f56954" data-height={20}>90,-80,90,70,-61,83,63</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="pages/examples/invoice.html">OR9842</a></td>
                                                <td>Call of Duty IV</td>
                                                <td><span className="badge badge-success">Shipped</span></td>
                                                <td>
                                                    <div className="sparkbar" data-color="#00a65a" data-height={20}>90,80,90,-70,61,-83,63</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer clearfix">
                                <a href="javascript:void(0)" className="btn btn-sm btn-info float-left">Place New Order</a>
                                <a href="javascript:void(0)" className="btn btn-sm btn-secondary float-right">View All Orders</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="info-box mb-3 bg-warning">
                            <span className="info-box-icon"><i className="fas fa-tag" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Inventory</span>
                                <span className="info-box-number">5,200</span>
                            </div>
                        </div>
                        <div className="info-box mb-3 bg-success">
                            <span className="info-box-icon"><i className="far fa-heart" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Mentions</span>
                                <span className="info-box-number">92,050</span>
                            </div>
                        </div>
                        <div className="info-box mb-3 bg-danger">
                            <span className="info-box-icon"><i className="fas fa-cloud-download-alt" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Downloads</span>
                                <span className="info-box-number">114,381</span>
                            </div>
                        </div>
                        <div className="info-box mb-3 bg-info">
                            <span className="info-box-icon"><i className="far fa-comment" /></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Direct Messages</span>
                                <span className="info-box-number">163,921</span>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Browser Usage</h3>
                                <div className="card-tools">
                                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                        <i className="fas fa-minus" />
                                    </button>
                                    <button type="button" className="btn btn-tool" data-card-widget="remove">
                                        <i className="fas fa-times" />
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="chart-responsive"><div className="chartjs-size-monitor"><div className="chartjs-size-monitor-expand"><div /></div><div className="chartjs-size-monitor-shrink"><div /></div></div>
                                            <canvas id="pieChart" height={125} width={250} style={{ display: 'block', width: 250, height: 125 }} className="chartjs-render-monitor" />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <ul className="chart-legend clearfix">
                                            <li><i className="far fa-circle text-danger" /> Chrome</li>
                                            <li><i className="far fa-circle text-success" /> IE</li>
                                            <li><i className="far fa-circle text-warning" /> FireFox</li>
                                            <li><i className="far fa-circle text-info" /> Safari</li>
                                            <li><i className="far fa-circle text-primary" /> Opera</li>
                                            <li><i className="far fa-circle text-secondary" /> Navigator</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer p-0">
                                <ul className="nav nav-pills flex-column">
                                    <li className="nav-item">
                                        <a href="#" className="nav-link">
                                            United States of America
                                            <span className="float-right text-danger">
                                                <i className="fas fa-arrow-down text-sm" />
                                                12%</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className="nav-link">
                                            India
                                            <span className="float-right text-success">
                                                <i className="fas fa-arrow-up text-sm" /> 4%
                                            </span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className="nav-link">
                                            China
                                            <span className="float-right text-warning">
                                                <i className="fas fa-arrow-left text-sm" /> 0%
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Recently Added Products</h3>
                                <div className="card-tools">
                                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                        <i className="fas fa-minus" />
                                    </button>
                                    <button type="button" className="btn btn-tool" data-card-widget="remove">
                                        <i className="fas fa-times" />
                                    </button>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <ul className="products-list product-list-in-card pl-2 pr-2">
                                    <li className="item">
                                        <div className="product-img">
                                            <img src="dist/img/default-150x150.png" alt="Product Image" className="img-size-50" />
                                        </div>
                                        <div className="product-info">
                                            <a href="javascript:void(0)" className="product-title">Samsung TV
                                                <span className="badge badge-warning float-right">$1800</span></a>
                                            <span className="product-description">
                                                Samsung 32" 1080p 60Hz LED Smart HDTV.
                                            </span>
                                        </div>
                                    </li>
                                    <li className="item">
                                        <div className="product-img">
                                            <img src="dist/img/default-150x150.png" alt="Product Image" className="img-size-50" />
                                        </div>
                                        <div className="product-info">
                                            <a href="javascript:void(0)" className="product-title">Bicycle
                                                <span className="badge badge-info float-right">$700</span></a>
                                            <span className="product-description">
                                                26" Mongoose Dolomite Men's 7-speed, Navy Blue.
                                            </span>
                                        </div>
                                    </li>
                                    <li className="item">
                                        <div className="product-img">
                                            <img src="dist/img/default-150x150.png" alt="Product Image" className="img-size-50" />
                                        </div>
                                        <div className="product-info">
                                            <a href="javascript:void(0)" className="product-title">
                                                Xbox One <span className="badge badge-danger float-right">
                                                    $350
                                                </span>
                                            </a>
                                            <span className="product-description">
                                                Xbox One Console Bundle with Halo Master Chief Collection.
                                            </span>
                                        </div>
                                    </li>
                                    <li className="item">
                                        <div className="product-img">
                                            <img src="dist/img/default-150x150.png" alt="Product Image" className="img-size-50" />
                                        </div>
                                        <div className="product-info">
                                            <a href="javascript:void(0)" className="product-title">PlayStation 4
                                                <span className="badge badge-success float-right">$399</span></a>
                                            <span className="product-description">
                                                PlayStation 4 500GB Console (PS4)
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-footer text-center">
                                <a href="javascript:void(0)" className="uppercase">View All Products</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}