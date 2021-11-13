class MMDElement extends HTMLElement {

  constructor () {
    super()
    window.MMD = window.MMD || {}
  }

  connectedCallback() {
    this.initialize()
  }

  initialize() {
    this.setupMethods()
    this.setupData()
    this.setupTargets()
    /* this.setupModels() */
  }

  setupMethods() {
    this.methods.forEach(method => {
      this[method] = this[method].bind(this)
    })
  }

  setupData () {

    this.data = {}
    this.datasets.forEach(dataset => {
      
      const datasetAlias = this.toAlias(dataset)
      const data = this.dataset[datasetAlias]
      if(!data) {
        this.error(`${this.elementName} is missing expected data: ${datasetAlias} (data-${dataset}="")`)
      }
      this.data[datasetAlias] = data ? data : ""
    })

  }

  setupTargets() {    

    this.targets.forEach(targetKey => {
      const selector = `[data-element="${this.elementAlias}.${targetKey}"]`
      const elements = [...this.querySelectorAll(selector)]

      if(!elements.length) {
        this.error(`${this.elementName} is missing an expected target: ${targetKey} (${selector})`)
      }

      const targetAlias = this.toAlias(targetKey)
      this[`${targetAlias}El`] = elements.at(0) ? elements.at(0) : null
      this[`${targetAlias}Els`] = elements

    })

  }

  /*
  setupModels () {

    this.models = {}
    const models = [...this.querySelectorAll(`[data-model^="${this.elementAlias}."]`)]

    console.log(models)

    models.forEach(model => {
      const modelName = model.dataset.model.replace(`${this.elementAlias}.`,'');
      this.models[modelName] = model.value
    })

    this.log(this.models)

  }
  */

  toAlias (string) {
    return string.replace(/-([a-z])/g, (match, char) => {
      return char.toUpperCase();
    })
  }

  log (param) {
    if (!this.debug) return
    console.log(param)
  }

  warn (param) {
    if (!this.debug) return
    console.warn(param)
  }

  error (param) {
    if (!this.debug) return
    console.error(param)
  }

  dir (param) {
    if (!this.debug) return
    console.dir(param)
  }

  exception(expression) {
    throw expression;
  }

  get methods () {
    return this._methods || []
  }

  set methods (methodArray) {
    this._methods = methodArray
  }

  get datasets () {
    return this._datasets || []
  }

  set datasets (datasetArray) {
    this._datasets = datasetArray
  }

  get targets () {
    return this._targets || []
  }

  set targets (targetArray) {
    this._targets = targetArray
  }

  get debug () {
    return window.MMD.debug || this._debug || false
  }

  set debug (debug) {
    this._debug = debug
  }

  get elementName () {
    return this.tagName.toLowerCase()
  }

  get elementAlias () {
    return this.id || this.elementName
  }

}
