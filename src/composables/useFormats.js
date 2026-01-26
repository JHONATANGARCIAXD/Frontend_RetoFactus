const formatters  = {}

formatters.price = (val) => {
    return val.toLocaleString('es-CO', { style: 'currency', currency: 'COP', useGrouping: true, maximumFractionDigits: 0 })
}


export {formatters}