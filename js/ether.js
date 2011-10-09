var Ether = {
    debug: {
        assert: function(condition, message)
        {
            if(condition)
            {
                throw new Ether.error(2, message)
            }
        },
        block: {
            /**
             * Use this constant to disable only one line of code
             */
            line: 0,
            /**
             * This function starts an debug block.
             * Everything between this and a Ether.debug.block.end()
             * will be deleted after running through ether.exe
             */
            start: function()
            {

            },
            /**
             * Ends an debug block. Everything after this line
             * will be outputted like normal.
             */
            end: function()
            {

            }
        },
        console: {
            observer: [],
            addObserver: function(name, observer, channels)
            {
                if(!channels || !name || !observer) throw new Ether.error(1, "Don't add observers without channel.");

                this.observer[this.observer.length] = {
                    method: observer,
                    name: name,
                    channels: channels instanceof Array?channels:[channels]
                };
            },
            log: function(channel, text)
            {
                for(var obs=null,index=0;obs = this.observer[index];++index)
                {
                    var send=false;
                    for(var index2=0, chan=null;chan=obs.channels[index2];++index2)
                    {
                        if(chan == "*" || chan == channel)
                        {
                            send = true;
                            break;
                        }
                    }
                    if(!send)
                    {
                        continue;
                    }
                    obs.method(channel, text);
                }
            }
        }
    },
    profiler: {
        /**
         * The table where all the profiling data will be stored.
         */
        blocks: [],
        /**
         * For the hierarchical profiling.
         */
        currentBlock: [],
        block: {
            /**
             * This function should be used to start profiling custom
             * blocks.
             * Just call it with an name under which it will be saved in
             * Ether.profiler.blocks and it starts to measure the consumed
             * time.
             * After the watched code use Ether.profile.block.end() to end
             * the call. Don't forget it otherwise it could ruin your entire
             * profiling table.
             *
             * @param {String} name The name under which the measurement will be saved
             */
            start: function(name)
            {
                Ether.profiler.currentBlock[Ether.profiler.currentBlock.length] = name;

                if(!Ether.profiler.blocks[name])
                {
                    Ether.profiler.blocks[name] = {
                        name: name,
                        calls:0,
                        averageTime:0,
                        longestTime:0,
                        totalTime:0,
                        childs: [],
                        parents: []
                    };
                }
                if(Ether.profiler.currentBlock.length>=2)
                {
                    var old = Ether.profiler.blocks[Ether.profiler.currentBlock[Ether.profiler.currentBlock.length-2]];
                    if(!old.childs[name])
                    {
                        old.childs[name] = {
                            name: name,
                            calls:0,
                            averageTime:0,
                            longestTime:0,
                            totalTime:0
                        };
                    }
                }
                Ether.profiler.blocks[name].start = new Date().getTime();
            },
            /**
             * Just used by Ether.profiler.profile().
             *
             * @param {Object} object The object that should be used as this
             * @param {Function} method The function
             * @param {Array} args The arguments for the method
             */
            work: function(object, method, args)
            {
                return method.apply(object, args);
            },
            /**
             * Call this function after start to end
             * the measurement.
             */
            end: function()
            {
                //Get current block
                var block = Ether.profiler.blocks[Ether.profiler.currentBlock[Ether.profiler.currentBlock.length-1]];

                if("undefined" === typeof block)
                {
                    return;
                }
                //Calculate the times and calls
                var currentDuration = new Date().getTime()-block.start;
                ++block.calls;
                block.averageTime = (currentDuration+block.averageTime)*0.5;
                block.longestTime = Math.max(currentDuration, block.longestTime);
                block.totalTime+= currentDuration;

                //Search a possible parent block
                if(Ether.profiler.currentBlock.length>=2)
                {
                    var index = Ether.profiler.currentBlock.length-2;
                    //Calculate the times and calls
                    block.parents[Ether.profiler.currentBlock[index]] = (block.parents[Ether.profiler.currentBlock[index]]||0)+1;
                    var old = Ether.profiler.blocks[Ether.profiler.currentBlock[index]];

                    ++old.childs[block.name].calls;
                    old.childs[block.name].averageTime = (currentDuration+old.childs[block.name].averageTime)*0.5;
                    old.childs[block.name].longestTime = Math.max(currentDuration, old.childs[block.name].longestTime);
                    old.childs[block.name].totalTime+= currentDuration;
                }

                Ether.profiler.currentBlock.pop();
            }
        },
        /**
         * This method can automatically set the appropriate
         * things to profile an function. In default mode it uses the
         * methods of Ether.block.
         *
         * To profile every function of an entire object just pass
         * null as method. It will automatically profile every method.
         *
         * @param {Object} object the object containing the function
         * @param {String} method the name of the function
         * @param {String} name optional, the namespace for the function
         * @param {Function} startBlock optional, custom logic before the function
         * @param {Function} doBlock optional, custom logic for starting the function
         * @param {Function} endBlock optional, custom logic for after the function
         */
        profile: function(object, method, name, startBlock, doBlock, endBlock)
        {
            if(!method) {
                for(var i in object) {
                    // if an object member is a function, automatically profile it
                    if("function" === typeof object[i]) {
                        this.profile(object, i, name, startBlock, doBlock, endBlock);
                    }
                }
                return;
            }

            // set the appropriate start, do and end call functions
            var that = this;
            if("undefined" === typeof startBlock) {
                startBlock = function() {
                    return that.block.start.apply(that.block, arguments);
                };
            }
            if("undefined" === typeof doBlock) {
                doBlock = function() {
                    return that.block.work.apply(that.block, arguments);
                };
            }
            if("undefined" === typeof endBlock) {
                endBlock = function() {
                    return that.block.end.apply(that.block, arguments);
                };
            }

            // get the function from the object
            var methodF = object[method];

            if("function" === typeof methodF) {
                var index = (name||"")+(name?".":"")+method;
                Ether.profiler.blocks[index] = {
                    name: index,
                    calls:0,
                    averageTime:0,
                    longestTime:0,
                    totalTime:0,
                    childs: [],
                    parents: []
                };

                // overwrite the function to handle before, after and during calls
                object[method] = function() {
                    try {
                        startBlock(index);
                        return doBlock(object, methodF, arguments);
                    }
                    finally {
                        endBlock(index);
                    }
                };
            }
        }
    },
    include: {
        /**
         * Fetches the content of an URL.
         *
         * @param {String} name
         */
        _: function(name) {
            var request = new XMLHttpRequest();
            request.open('GET', name, false);
            request.send(null);
            if (request.status == 200 || request.status == 0) {
                return request;
            } else {
                throw new Ether.error(0, "Could not load " + name);
            }
        },
        /**
         * Includes an JSON File and returns it parsed.
         *
         * @param {String} name
         */
        JSON: function(name) {
            return JSON.parse(this._(name).responseText);
        },
        /**
         * Includes a HTML File.
         *
         * @param {String} name
         */
        HTML: function(name) {
            return this._(name).responseText;
        },
        /**
         * Includes a JavaScript file.
         * Checks if it's already included.
         *
         * @param {String} name
         */
        JavaScript: function(name) {
            var scripts = document.getElementsByTagName('script');
            if (scripts) {
                for (var index = 0; index < scripts.length; ++index) {
                    if (scripts[index].src == name || scripts[index].isrc == name) return;
                }
            }

            var script = document.createElement('script');
            script.isrc = name;
            script.appendChild(document.createTextNode(this._(name).responseText));
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    },
    /**
     * Used for exceptions invoked by the compiler.
     *
     * @param {Number} number Errorcode
     * @param {String} text Errormessage
     * @param {Ether.error} previous  optional, previous error
     */
    error: function(number, text, previous)
    {
        this.number = number;
        this.text = text;
        this.previous = previous;
    }
};
Ether.profiler.profile(Ether.include, null, "Ether.include");
Ether.profiler.profile(Ether.console, null, "Ether.console");
Ether.include.JavaScript(document.getElementsByTagName('script')[0].dataset.main);