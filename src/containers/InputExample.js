import React from 'react'
import Header from '../components/header'
import SideNav from '../components/side-nav'
import Footer from '../components/footer'

export default function InputExample() {
  return (
    <>
        <Header/>
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <section className="content-header">
                <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                    <h1>Add Match</h1>
                    </div>
                    <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                        <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                        <li className="breadcrumb-item active">Add Match</li>
                    </ol>
                    </div>
                </div>
                </div>{/* /.container-fluid */}
            </section>
            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        {/* left column */}
                        <div className="col-md-12">
                            {/* general form elements */}
                            <div className="card card-secondary">
                                <div className="card-header">
                                <h3 className="card-title">Add Match Form</h3>
                                </div>
                                {/* /.card-header */}
                                {/* form start */}
                                <form>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="team_a">Team A</label>
                                                    <input type="text" className="form-control" id="team_a" placeholder="Team A" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="team_b">Team B</label>
                                                    <input type="text" className="form-control" id="team_b" placeholder="Team B" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="team_a_short">Team A Short</label>
                                                    <input type="text" className="form-control" id="team_a_short" placeholder="Team A Short" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="team_b_short">Team B Short</label>
                                                    <input type="text" className="form-control" id="team_b_short" placeholder="Team B Short" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="team_a_id">Team A ID</label>
                                                    <input type="text" className="form-control" id="team_a_id" placeholder="Team A ID" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="team_b_id">Team B ID</label>
                                                    <input type="text" className="form-control" id="team_b_id" placeholder="Team B ID" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="date">Date</label>
                                                    <input type="date" className="form-control" id="date" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="time">Time</label>
                                                    <input type="time" className="form-control" id="time" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="day">Day</label>
                                                    <input type="text" className="form-control" id="day" placeholder="Day" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="ground_name">Ground Name</label>
                                                    <input type="text" className="form-control" id="ground_name" placeholder="Ground Name" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="team_a_img">Team A Image</label>
                                                    <input type="text" className="form-control" id="team_a_img" placeholder="Team A Image" />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="team_b_img">Team B Image</label>
                                                    <input type="text" className="form-control" id="team_b_img" placeholder="Team B Image"/>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="toss">Toss</label>
                                                    <input type="text" className="form-control" id="toss" placeholder="Toss"/>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="umpire">Umpire</label>
                                                    <input type="text" className="form-control" id="umpire" placeholder="Umpire"/>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="third_umpire">Third Umpire</label>
                                                    <input type="text" className="form-control" id="third_umpire" placeholder="Third Umpire"/>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="referee">Referee</label>
                                                    <input type="text" className="form-control" id="referee" placeholder="Referee"/>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="matchs">Match Name</label>
                                                    <input type="text" className="form-control" id="matchs" placeholder="Match Name"/>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="series_name">Series Name</label>
                                                    <select className="form-control" id="series_name">
                                                        <option>option 1</option>
                                                        <option>option 2</option>
                                                        <option>option 3</option>
                                                        <option>option 4</option>
                                                        <option>option 5</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="match_category">Match Status</label>
                                                    <select className="form-control" id="match_category">
                                                        <option>option 1</option>
                                                        <option>option 2</option>
                                                        <option>option 3</option>
                                                        <option>option 4</option>
                                                        <option>option 5</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="match_id">Match ID <span className="text-danger font-italic font-underline">(Important)</span></label>
                                                    <input type="text" className="form-control" id="match_id" placeholder="Match ID"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /.card-body */}
                                    <div className="card-footer">
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </form>
                            </div>
                            {/* /.card */}
                            {/* general form elements */}
                            <div className="card card-primary">
                                <div className="card-header">
                                <h3 className="card-title">Different Styles</h3>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                <h4>Input</h4>
                                <div className="form-group">
                                    <label htmlFor="exampleInputBorder">Bottom Border only <code>.form-control-border</code></label>
                                    <input type="text" className="form-control form-control-border" id="exampleInputBorder" placeholder=".form-control-border" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputBorderWidth2">Bottom Border only 2px Border <code>.form-control-border.border-width-2</code></label>
                                    <input type="text" className="form-control form-control-border border-width-2" id="exampleInputBorderWidth2" placeholder=".form-control-border.border-width-2" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputRounded0">Flat <code>.rounded-0</code></label>
                                    <input type="text" className="form-control rounded-0" id="exampleInputRounded0" placeholder=".rounded-0" />
                                </div>
                                <h4>Custom Select</h4>
                                <div className="form-group">
                                    <label htmlFor="exampleSelectBorder">Bottom Border only <code>.form-control-border</code></label>
                                    <select className="custom-select form-control-border" id="exampleSelectBorder">
                                    <option>Value 1</option>
                                    <option>Value 2</option>
                                    <option>Value 3</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleSelectBorderWidth2">Bottom Border only <code>.form-control-border.border-width-2</code></label>
                                    <select className="custom-select form-control-border border-width-2" id="exampleSelectBorderWidth2">
                                    <option>Value 1</option>
                                    <option>Value 2</option>
                                    <option>Value 3</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleSelectRounded0">Flat <code>.rounded-0</code></label>
                                    <select className="custom-select rounded-0" id="exampleSelectRounded0">
                                    <option>Value 1</option>
                                    <option>Value 2</option>
                                    <option>Value 3</option>
                                    </select>
                                </div>
                                </div>
                                {/* /.card-body */}
                            </div>
                            {/* /.card */}
                            {/* Input addon */}
                            <div className="card card-info">
                                <div className="card-header">
                                <h3 className="card-title">Input Addon</h3>
                                </div>
                                <div className="card-body">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                    <span className="input-group-text">@</span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Username" />
                                </div>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" />
                                    <div className="input-group-append">
                                    <span className="input-group-text">.00</span>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                    <span className="input-group-text">$</span>
                                    </div>
                                    <input type="text" className="form-control" />
                                    <div className="input-group-append">
                                    <span className="input-group-text">.00</span>
                                    </div>
                                </div>
                                <h4>With icons</h4>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-envelope" /></span>
                                    </div>
                                    <input type="email" className="form-control" placeholder="Email" />
                                </div>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" />
                                    <div className="input-group-append">
                                    <span className="input-group-text"><i className="fas fa-check" /></span>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <i className="fas fa-dollar-sign" />
                                    </span>
                                    </div>
                                    <input type="text" className="form-control" />
                                    <div className="input-group-append">
                                    <div className="input-group-text"><i className="fas fa-ambulance" /></div>
                                    </div>
                                </div>
                                <h5 className="mt-4 mb-2">With checkbox and radio inputs</h5>
                                <div className="row">
                                    <div className="col-lg-6">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <input type="checkbox" />
                                        </span>
                                        </div>
                                        <input type="text" className="form-control" />
                                    </div>
                                    {/* /input-group */}
                                    </div>
                                    {/* /.col-lg-6 */}
                                    <div className="col-lg-6">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                        <span className="input-group-text"><input type="radio" /></span>
                                        </div>
                                        <input type="text" className="form-control" />
                                    </div>
                                    {/* /input-group */}
                                    </div>
                                    {/* /.col-lg-6 */}
                                </div>
                                {/* /.row */}
                                <h5 className="mt-4 mb-2">With buttons</h5>
                                <p>Large: <code>.input-group.input-group-lg</code></p>
                                <div className="input-group input-group-lg mb-3">
                                    <div className="input-group-prepend">
                                    <button type="button" className="btn btn-warning dropdown-toggle" data-toggle="dropdown">
                                        Action
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li className="dropdown-item"><a href="#">Action</a></li>
                                        <li className="dropdown-item"><a href="#">Another action</a></li>
                                        <li className="dropdown-item"><a href="#">Something else here</a></li>
                                        <li className="dropdown-divider" />
                                        <li className="dropdown-item"><a href="#">Separated link</a></li>
                                    </ul>
                                    </div>
                                    {/* /btn-group */}
                                    <input type="text" className="form-control" />
                                </div>
                                {/* /input-group */}
                                <p>Normal</p>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                    <button type="button" className="btn btn-danger">Action</button>
                                    </div>
                                    {/* /btn-group */}
                                    <input type="text" className="form-control" />
                                </div>
                                {/* /input-group */}
                                <p>Small <code>.input-group.input-group-sm</code></p>
                                <div className="input-group input-group-sm">
                                    <input type="text" className="form-control" />
                                    <span className="input-group-append">
                                    <button type="button" className="btn btn-info btn-flat">Go!</button>
                                    </span>
                                </div>
                                {/* /input-group */}
                                </div>
                                {/* /.card-body */}
                            </div>
                            {/* /.card */}
                            {/* Horizontal Form */}
                            <div className="card card-info">
                                <div className="card-header">
                                <h3 className="card-title">Horizontal Form</h3>
                                </div>
                                {/* /.card-header */}
                                {/* form start */}
                                <form className="form-horizontal">
                                <div className="card-body">
                                    <div className="form-group row">
                                    <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
                                    <div className="col-sm-10">
                                        <input type="email" className="form-control" id="inputEmail3" placeholder="Email" />
                                    </div>
                                    </div>
                                    <div className="form-group row">
                                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
                                    <div className="col-sm-10">
                                        <input type="password" className="form-control" id="inputPassword3" placeholder="Password" />
                                    </div>
                                    </div>
                                    <div className="form-group row">
                                    <div className="offset-sm-2 col-sm-10">
                                        <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck2" />
                                        <label className="form-check-label" htmlFor="exampleCheck2">Remember me</label>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                {/* /.card-body */}
                                <div className="card-footer">
                                    <button type="submit" className="btn btn-info">Sign in</button>
                                    <button type="submit" className="btn btn-default float-right">Cancel</button>
                                </div>
                                {/* /.card-footer */}
                                </form>
                            </div>
                            {/* /.card */}
                        </div>
                        {/*/.col (left) */}
                        {/* right column */}
                        <div className="col-md-6">
                        {/* Form Element sizes */}
                        <div className="card card-success">
                            <div className="card-header">
                            <h3 className="card-title">Different Height</h3>
                            </div>
                            <div className="card-body">
                            <input className="form-control form-control-lg" type="text" placeholder=".form-control-lg" />
                            <br />
                            <input className="form-control" type="text" placeholder="Default input" />
                            <br />
                            <input className="form-control form-control-sm" type="text" placeholder=".form-control-sm" />
                            </div>
                            {/* /.card-body */}
                        </div>
                        {/* /.card */}
                        <div className="card card-danger">
                            <div className="card-header">
                            <h3 className="card-title">Different Width</h3>
                            </div>
                            <div className="card-body">
                            <div className="row">
                                <div className="col-3">
                                <input type="text" className="form-control" placeholder=".col-3" />
                                </div>
                                <div className="col-4">
                                <input type="text" className="form-control" placeholder=".col-4" />
                                </div>
                                <div className="col-5">
                                <input type="text" className="form-control" placeholder=".col-5" />
                                </div>
                            </div>
                            </div>
                            {/* /.card-body */}
                        </div>
                        {/* /.card */}
                        {/* general form elements disabled */}
                        <div className="card card-warning">
                            <div className="card-header">
                            <h3 className="card-title">General Elements</h3>
                            </div>
                            {/* /.card-header */}
                            <div className="card-body">
                            <form>
                                <div className="row">
                                <div className="col-sm-6">
                                    {/* text input */}
                                    <div className="form-group">
                                    <label>Text</label>
                                    <input type="text" className="form-control" placeholder="Enter ..." />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                    <label>Text Disabled</label>
                                    <input type="text" className="form-control" placeholder="Enter ..." disabled />
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col-sm-6">
                                    {/* textarea */}
                                    <div className="form-group">
                                    <label>Textarea</label>
                                    <textarea className="form-control" rows={3} placeholder="Enter ..." defaultValue={""} />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                    <label>Textarea Disabled</label>
                                    <textarea className="form-control" rows={3} placeholder="Enter ..." disabled defaultValue={""} />
                                    </div>
                                </div>
                                </div>
                                {/* input states */}
                                <div className="form-group">
                                <label className="col-form-label" htmlFor="inputSuccess"><i className="fas fa-check" /> Input with
                                    success</label>
                                <input type="text" className="form-control is-valid" id="inputSuccess" placeholder="Enter ..." />
                                </div>
                                <div className="form-group">
                                <label className="col-form-label" htmlFor="inputWarning"><i className="far fa-bell" /> Input with
                                    warning</label>
                                <input type="text" className="form-control is-warning" id="inputWarning" placeholder="Enter ..." />
                                </div>
                                <div className="form-group">
                                <label className="col-form-label" htmlFor="inputError"><i className="far fa-times-circle" /> Input with
                                    error</label>
                                <input type="text" className="form-control is-invalid" id="inputError" placeholder="Enter ..." />
                                </div>
                                <div className="row">
                                <div className="col-sm-6">
                                    {/* checkbox */}
                                    <div className="form-group">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" />
                                        <label className="form-check-label">Checkbox</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" defaultChecked />
                                        <label className="form-check-label">Checkbox checked</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" disabled />
                                        <label className="form-check-label">Checkbox disabled</label>
                                    </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    {/* radio */}
                                    <div className="form-group">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="radio1" />
                                        <label className="form-check-label">Radio</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="radio1" defaultChecked />
                                        <label className="form-check-label">Radio checked</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" disabled />
                                        <label className="form-check-label">Radio disabled</label>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col-sm-6">
                                    {/* select */}
                                    <div className="form-group">
                                    <label>Select</label>
                                    <select className="form-control">
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                    <label>Select Disabled</label>
                                    <select className="form-control" disabled>
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col-sm-6">
                                    {/* Select multiple*/}
                                    <div className="form-group">
                                    <label>Select Multiple</label>
                                    <select multiple className="form-control">
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                    <label>Select Multiple Disabled</label>
                                    <select multiple className="form-control" disabled>
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                    </div>
                                </div>
                                </div>
                            </form>
                            </div>
                            {/* /.card-body */}
                        </div>
                        {/* /.card */}
                        {/* general form elements disabled */}
                        <div className="card card-secondary">
                            <div className="card-header">
                            <h3 className="card-title">Custom Elements</h3>
                            </div>
                            {/* /.card-header */}
                            <div className="card-body">
                            <form>
                                <div className="row">
                                <div className="col-sm-6">
                                    {/* checkbox */}
                                    <div className="form-group">
                                    <div className="custom-control custom-checkbox">
                                        <input className="custom-control-input" type="checkbox" id="customCheckbox1" defaultValue="option1" />
                                        <label htmlFor="customCheckbox1" className="custom-control-label">Custom Checkbox</label>
                                    </div>
                                    <div className="custom-control custom-checkbox">
                                        <input className="custom-control-input" type="checkbox" id="customCheckbox2" defaultChecked />
                                        <label htmlFor="customCheckbox2" className="custom-control-label">Custom Checkbox checked</label>
                                    </div>
                                    <div className="custom-control custom-checkbox">
                                        <input className="custom-control-input" type="checkbox" id="customCheckbox3" disabled />
                                        <label htmlFor="customCheckbox3" className="custom-control-label">Custom Checkbox disabled</label>
                                    </div>
                                    <div className="custom-control custom-checkbox">
                                        <input className="custom-control-input custom-control-input-danger" type="checkbox" id="customCheckbox4" defaultChecked />
                                        <label htmlFor="customCheckbox4" className="custom-control-label">Custom Checkbox with custom color</label>
                                    </div>
                                    <div className="custom-control custom-checkbox">
                                        <input className="custom-control-input custom-control-input-danger custom-control-input-outline" type="checkbox" id="customCheckbox5" defaultChecked />
                                        <label htmlFor="customCheckbox5" className="custom-control-label">Custom Checkbox with custom color outline</label>
                                    </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    {/* radio */}
                                    <div className="form-group">
                                    <div className="custom-control custom-radio">
                                        <input className="custom-control-input" type="radio" id="customRadio1" name="customRadio" />
                                        <label htmlFor="customRadio1" className="custom-control-label">Custom Radio</label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input className="custom-control-input" type="radio" id="customRadio2" name="customRadio" defaultChecked />
                                        <label htmlFor="customRadio2" className="custom-control-label">Custom Radio checked</label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input className="custom-control-input" type="radio" id="customRadio3" disabled />
                                        <label htmlFor="customRadio3" className="custom-control-label">Custom Radio disabled</label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input className="custom-control-input custom-control-input-danger" type="radio" id="customRadio4" name="customRadio2" defaultChecked />
                                        <label htmlFor="customRadio4" className="custom-control-label">Custom Radio with custom color</label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input className="custom-control-input custom-control-input-danger custom-control-input-outline" type="radio" id="customRadio5" name="customRadio2" />
                                        <label htmlFor="customRadio5" className="custom-control-label">Custom Radio with custom color outline</label>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col-sm-6">
                                    {/* select */}
                                    <div className="form-group">
                                    <label>Custom Select</label>
                                    <select className="custom-select">
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                    <label>Custom Select Disabled</label>
                                    <select className="custom-select" disabled>
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col-sm-6">
                                    {/* Select multiple*/}
                                    <div className="form-group">
                                    <label>Custom Select Multiple</label>
                                    <select multiple className="custom-select">
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                    <label>Custom Select Multiple Disabled</label>
                                    <select multiple className="custom-select" disabled>
                                        <option>option 1</option>
                                        <option>option 2</option>
                                        <option>option 3</option>
                                        <option>option 4</option>
                                        <option>option 5</option>
                                    </select>
                                    </div>
                                </div>
                                </div>
                                <div className="form-group">
                                <div className="custom-control custom-switch">
                                    <input type="checkbox" className="custom-control-input" id="customSwitch1" />
                                    <label className="custom-control-label" htmlFor="customSwitch1">Toggle this custom switch element</label>
                                </div>
                                </div>
                                <div className="form-group">
                                <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                                    <input type="checkbox" className="custom-control-input" id="customSwitch3" />
                                    <label className="custom-control-label" htmlFor="customSwitch3">Toggle this custom switch element with custom colors danger/success</label>
                                </div>
                                </div>
                                <div className="form-group">
                                <div className="custom-control custom-switch">
                                    <input type="checkbox" className="custom-control-input" disabled id="customSwitch2" />
                                    <label className="custom-control-label" htmlFor="customSwitch2">Disabled custom switch element</label>
                                </div>
                                </div>
                                <div className="form-group">
                                <label htmlFor="customRange1">Custom range</label>
                                <input type="range" className="custom-range" id="customRange1" />
                                </div>
                                <div className="form-group">
                                <label htmlFor="customRange2">Custom range (custom-range-danger)</label>
                                <input type="range" className="custom-range custom-range-danger" id="customRange2" />
                                </div>
                                <div className="form-group">
                                <label htmlFor="customRange3">Custom range (custom-range-teal)</label>
                                <input type="range" className="custom-range custom-range-teal" id="customRange3" />
                                </div>
                                <div className="form-group">
                                {/* <label for="customFile">Custom File</label> */}
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="customFile" />
                                    <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                                </div>
                                </div>
                                <div className="form-group">
                                </div>
                            </form>
                            </div>
                            {/* /.card-body */}
                        </div>
                        {/* /.card */}
                        </div>
                        {/*/.col (right) */}
                    </div>
                {/* /.row */}
                </div>{/* /.container-fluid */}
            </section>
            {/* /.content */}
        </div>
        <SideNav/>
        <Footer/>
    </>
  )
}
