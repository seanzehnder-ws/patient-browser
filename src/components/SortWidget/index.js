import React from "react"
import "./SortWidget.less"


export default class SortWidget extends React.Component
{
    static propTypes = {
        /**
         * Fhir sort string like "status,-date,category"
         */
        sort: React.PropTypes.string,

        options: React.PropTypes.arrayOf(React.PropTypes.shape({
            name : React.PropTypes.string,
            value: React.PropTypes.string
        })),

        onChange: React.PropTypes.func
    };

    static defaultProps = {
        sort: "name,-birthdate",
        options: [
            {
                name : "Patient ID",
                value: "_id"
            },
            {
                name : "Name",
                value: "given"
            },
            {
                name : "Gender",
                value: "gender"
            },
            {
                name : "DOB",
                value: "birthdate"
            }
        ]
    };

    change(name, value) {
        // console.log(name, value)
        if (typeof this.props.onChange == "function") {
            let sort = this.parseSort(this.props.sort)
            if (!value) {
                if (sort.hasOwnProperty(name)) {
                    delete sort[name];
                }
            }
            else {
                sort[name] = value
            }
            // console.log(sort, this.compileSort(sort))
            this.props.onChange(this.compileSort(sort))
        }
    }

    parseSort(input) {
        let sort = {};
        String(input || "").split(",").filter(Boolean).forEach(s => {
            let name = s.replace(/^\-/, "");
            sort[name] = s.indexOf("-") === 0 ? "desc" : "asc";
        })
        return sort
    }

    compileSort(sort) {
        return Object.keys(sort).map(k => sort[k] == "desc" ? `-${k}` : k).join(",")
    }

    render() {
        let sort = this.parseSort(this.props.sort)

        return (
            <div className="sort-widget small">
                <span className="pull-left">Sort by: </span>
                <ul className="nav nav-pills">
                {
                    this.props.options.map((o, i) => (
                        <li
                            key={ i }
                            role="presentation"
                            className={ o.value in sort ? "active" : null }
                        >
                            <a href="#" onClick={ e => {
                                e.preventDefault()
                                let _sort = this.parseSort(this.props.sort)
                                switch (_sort[o.value]) {
                                case "asc":
                                    return this.change(o.value, "desc")
                                case "desc":
                                    return this.change(o.value, "")
                                default:
                                    return this.change(o.value, "asc")
                                }
                            }}>
                                { o.name }
                                {
                                    sort[o.value] == "asc" ?
                                    <span> Asc <i className="fa fa-sort-amount-asc"/></span> :
                                        sort[o.value] == "desc" ?
                                        <span> Desc <i className="fa fa-sort-amount-desc"/></span> :
                                        null
                                }
                            </a>
                        </li>
                    ))
                }
                </ul>
            </div>
        )
    }
}