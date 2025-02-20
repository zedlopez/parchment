/*

Parchment Launcher
==================

Copyright (c) 2021 Dannii Willis
MIT licenced
https://github.com/curiousdannii/parchment

*/

import {fetch_storyfile, fetch_vm_resource} from './file.js'
import {formats, parse_blorb} from './formats.js'
import GlkOte from '../upstream/glkote/glkote.js'

const default_options = {
    auto_launch: 1,
    //default_story: [PATH_TO_JSIFIED_STORY]
    do_vm_autosave: 1,
    lib_path: 'dist/web/',
    proxy_url: 'https://proxy.iplayif.com/proxy/',
    //story: PATH_TO_STORY
}

class ParchmentLauncher
{
    constructor(parchment_options) {
        this.options = Object.assign({}, default_options, parchment_options, this.query_options())
    }

    find_format(format, path) {
        for (const formatspec of formats) {
            if (formatspec.id === format || formatspec.extensions.test(path)) {
                return formatspec
            }
        }
        throw new Error('Unknown storyfile format')
    }

    get_storyfile_path() {
        return this.options.story || this.options.default_story?.[0] || null
    }

    launch() {
        try {
            const storyfile_path = this.get_storyfile_path()
            if (!storyfile_path) {
                $('#custom-file-upload').show().on('keydown', event => {
                    if (event.keyCode === 32 /*Space*/ || event.keyCode === 13 /*Enter*/) {
                        event.target.click()
                    }
                })
                $('#file-upload').on('change', () => {
                    const file = $('#file-upload')[0]?.files?.[0]
                    if (file) this.load_uploaded_file(file)
                })
                return
            }

            const format = this.find_format(null, storyfile_path)
            this.load(format, storyfile_path)
        }
        catch (err) {
            GlkOte.error(err)
            throw err
        }
    }

    // Overloaded load
    // engine can be a engine object or id
    // story can be a path or Uint8Array
    async load(format, story) {
        try {
            // Hide the about page, and show the loading spinner instead
            $('#about').remove()
            $('#loadingpane').show()

            // If a blorb URL doesn't specify its type, we must download it first
            if (format.id === 'blorb') {
                if (typeof story === 'string') {
                    story = await fetch_storyfile(this.options, story)
                }
                format = parse_blorb(story)
            }

            if (typeof format === 'string') {
                format = this.find_format(format)
            }
            const engine = format.engines[0]

            const requires = await Promise.all([
                typeof story === 'string' ? fetch_storyfile(this.options, story) : story,
                ...engine.load.map(path => fetch_vm_resource(this.options, path))
            ])

            await engine.start(this.options, requires)
        }
        catch (err) {
            GlkOte.error(err)
            throw err
        }
    }

    async load_uploaded_file(file) {
        try {
            const format = this.find_format(null, file.name)
            this.load(format, await this.read_uploaded_file(file))
        }
        catch (err) {
            GlkOte.error(err)
            throw err
        }
    }

    read_uploaded_file(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = event => resolve(new Uint8Array(event.target.result))
            reader.onerror = () => reject(reader.error)
            reader.readAsArrayBuffer(file)
        })
    }

    query_options() {
        // Some options can be specified in the URL query
        const query = new URLSearchParams(document.location.search)
        const options = {}
        const query_options = ['do_vm_autosave', 'story']
        for (const option of query_options) {
            if (query.has(option)) {
                options[option] = query.get(option)
            }
        }
        return options
    }
}

$(() => {
    const parchment = new ParchmentLauncher(window.parchment_options)
    window.parchment = parchment

    if (parchment.options.auto_launch) {
        parchment.launch()
    }
})
