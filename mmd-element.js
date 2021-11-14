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
    this.setupModels()
    this.setupListeners()
    this.dir(this)
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
      const selector = `[data-${this.elementIdentifier}\\:target="${targetKey}"]`
      const elements = [...this.querySelectorAll(selector)]

      if(!elements.length) {
        this.error(`${this.elementName} is missing an expected target: ${targetKey} (${selector})`)
      }

      const targetAlias = this.toAlias(targetKey)
      this[`${targetAlias}El`] = elements.at(0) ? elements.at(0) : null
      this[`${targetAlias}Els`] = elements
    })

  }

  setupListeners() {
    this.addEventListener("input", event => {
      const modelName = this.getModelName(event.target)
      if(!modelName) return
      this.data[this.toAlias(modelName)] = event.target.value
      this.modelUpdated(modelName)
    })
  }

  setupModels () {
    const models = [...this.querySelectorAll(`[data-${this.elementIdentifier}\\:model]`)]
    const modelAlias = this.toAlias(`${this.elementIdentifier}:model`)
    models.forEach(model => {
      const modelName = model.dataset[modelAlias];
      this.data[this.toAlias(modelName)] = model.value
    })
  }

  modelUpdated (modelName) {
    const bindEls = [...this.querySelectorAll(`[data-${this.elementIdentifier}\\:bind="${modelName}"]`)]
    bindEls.forEach(bindEl => bindEl.textContent = this.data[this.toAlias(modelName)])
  }

  getElementName (element) {
    return this.getData(element,'element')
  }

  getModelName (element) {
    return this.getData(element,'model')
  }

  getData (element,key) {
    const keyAlias = this.toAlias(`${this.elementIdentifier}:${key}`)
    return element.dataset[keyAlias] ? element.dataset[keyAlias] : null
  }

  toAlias (string) {
    return string.replace(/-([a-z])/g, (match, char) => {
      return char.toUpperCase();
    })
  }

  firstOrAll (args) {
    return args.length === 1 ? args.at(0) : args
  }

  log (...args) {
    if (!this.debug) return
    console.log(this.firstOrAll(args))
  }

  warn (...args) {
    if (!this.debug) return
    console.warn(this.firstOrAll(args))
  }

  error (...args) {
    if (!this.debug) return
    console.error(this.firstOrAll(args))
  }

  dir (...args) {
    if (!this.debug) return
    console.dir(this.firstOrAll(args))
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

  get elementIdentifier () {
    return this.id || this.elementName
  }

}
