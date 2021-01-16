#!/usr/bin/env bash
#
# Setup, build or watch the @react-cad/core wasm library
# Style guideline: https://google.github.io/styleguide/shell.xml

#######################################
# Globals
# Get script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

set -eo pipefail

#######################################
# Shows help usage
# Globals:
#   None
# Arguments:
#   None
# Returns:
#   None
#######################################
function show_help() {
    cat << EOF
Usage: ${0##*/} -b BUILD_DIR -s SOURCE_DIR -d DEST_DIR -f [ setup | build | watch | ci]
Sets up, builds or watches the @react-cad/core wasm library
    -h                             Display this help and exit.
    -b BUILD_DIR                   Location of working dir
    -s SOURCE_DIR                  Location of source code
    -d DEST_DIR                    Location to install binary
    -f FUNCTION                    The function to perform
EOF
}

#######################################
# Parse script options
# Globals:
#   None
# Arguments:
#   None
# Returns:
#   ENVIRONMENT
#######################################
function parse_options() {
    # Resetting OPTIND is necessary if getopts was used previously in the script.
    # It is a good idea to make OPTIND local if you process options in a function.
    local OPTIND=1

    while getopts h:b:s:d:f: opt; do
        case $opt in
            h)
                show_help
                exit 0
                ;;
            b)  BUILD_DIR=$OPTARG
                ;;
            s)  SOURCE_DIR=$OPTARG
                ;;
            d)  DEST_DIR=$OPTARG
                ;;
            f)  FUNCTION=$OPTARG
                ;;
            *)
                show_help >&2
                exit 1
                ;;
        esac
    done
    shift "$((OPTIND-1))"   # Discard the options and sentinel --

    if [ ! "${FUNCTION}" ]; then
        echo "No function was provided"
        show_help >&2
        exit 1
    fi

    local build_dir_required=
    local source_dir_required=
    local dest_dir_required=

    if [ "${FUNCTION}" == "setup" ] || [ "${FUNCTION}" == "ci" ] || [ "${FUNCTION}" == "dev" ]; then
        build_dir_required=1
        source_dir_required=1
        dest_dir_required=1
    fi
    if [ "${FUNCTION}" == "build" ]; then
        build_dir_required=1
    fi
    if [ "${FUNCTION}" == "watch" ]; then
        build_dir_required=1
        source_dir_required=1
    fi

    if [ "${build_dir_required}" ] && [ ! "${BUILD_DIR}" ]; then
        echo "No build directory was provided"
        show_help >&2
        exit 1
    fi

    if [ "${source_dir_required}" ] && [ ! "${SOURCE_DIR}" ]; then
        echo "No source directory was provided "
        show_help >&2
        exit 1
    fi

    if [ "${dest_dir_required}" ] && [ ! "${DEST_DIR}" ]; then
        echo "No destination directory was provided "
        show_help >&2
        exit 1
    fi
}

#######################################
# Sets up the cmake build
# Globals:
#   None
# Arguments:
#   source_dir dest_dir build_dir
# Returns:
#   None
#######################################
function setup(){
    local src=${1}
    local dest=${2}
    local build_dir=${3}

    mkdir -p ${build_dir} && cd ${build_dir}
    emcmake cmake ${src} \
      -DOpenCASCADE_DIR=/opt/occt/lib/cmake/opencascade \
      -DCMAKE_INSTALL_PREFIX=${dest}
}

#######################################
# Builds the wasm library
# Globals:
#   None
# Arguments:
#   build_dir
# Returns:
#   None
#######################################
function build(){
    local build_dir=${1}

    cd ${build_dir}
    emmake make install
}

#######################################
# Watches the source for changes
# Globals:
#   None
# Arguments:
#   source_dir build_dir
# Returns:
#   None
#######################################
function watch(){
    local src=${1}
    local build_dir=${2}

    function _term() {
      kill -TERM "$child" 2>/dev/null
    }

    trap _term SIGTERM

    fswatch -o --event Updated ${src} \
        | \
        while read event; do \
          build ${build_dir}; \
          read event;
        done &

    local child=$!
    wait "$child"

}

#######################################
# Main script logic
# Globals:
#   SOURCE_DIR DEST_DIR BUILD_DIR
# Arguments:
#   None
# Returns:
#   None
#######################################
function main(){
    parse_options "$@"

    # Logic to select the action to take on the script
    if [[ "${FUNCTION}" == 'ci' ]]; then
        setup ${SOURCE_DIR} ${DEST_DIR} ${BUILD_DIR}
        build ${BUILD_DIR}
    elif [[ "${FUNCTION}" == 'dev' ]]; then
        setup ${SOURCE_DIR} ${DEST_DIR} ${BUILD_DIR}
        build ${BUILD_DIR}
        watch ${SOURCE_DIR} ${BUILD_DIR}
    elif [[ "${FUNCTION}" == 'setup' ]]; then
        setup ${SOURCE_DIR} ${DEST_DIR} ${BUILD_DIR}
    elif [[ "${FUNCTION}" == 'build' ]]; then
        build ${BUILD_DIR}
    elif [[ "${FUNCTION}" == 'watch' ]]; then
        watch ${SOURCE_DIR} ${BUILD_DIR}
    else
        echo "The function selected is not available"
        show_help >&2
        exit 1
    fi

}

main $@
