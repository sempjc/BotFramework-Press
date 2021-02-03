<?php
/**
 * Bot Framework Press
 * 
 * Plugin Name: Bot Framework Press
 * Description: A Bot Framework Content Manager plugin.
 * Version: 0.1.0 
 * Requires at least: 5.2
 * Requires PHP: 7.2
 * Text Domain: my-basics-plugin
 * Domain Path: /languages
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Network: True
 */

 /*
    Bot Framework Press is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    any later version.
    
    Bot Framework Press is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with Bot Framework Press. If not, see https://www.gnu.org/licenses/gpl-2.0.html. 
*/

// This is a demo

class WP_Botframework_Press {
    public $plugin_domain;
    public $views_dir;
    public $version;

    public function __construct(){
        $this->plugin_domain = 'wp-botframework-press';
        $this-> views_dir = trailingslashit(dirname(__FILE__)).'server/views';
        $this-> version = '0.1.0';

        require_once  __DIR__ . '/server/wp-botframework-press-server.php';
        $wp_rest_server = new WP_BP_Rest_Server();
        $wp_rest_server-> init();

        add_action('admin_menu', array($this, 'admin_menu'));
    }

    public function admin_menu() {
        // $page_title = "Botframework Press";
        // $menu_title = $page_title;
        // $capability = 'manage_options';
        // $menu_slug = 'botframework-press';
        // $function = 'admin_menu';
        // $icon_url = 'dashicons-media-code';
        // $position   = 4;

        // add_menu_page( $page_title, $menu_title, $capability, $menu_slug, $function, $icon_url, $position );


        $title = 'Botframework Press';

        $hook_suffix = add_management_page(
            $title, 
            $title, 
            'manage_options', 
            $this->plugin_domain, 
            array(
                $this,
                'load_admin_view',
            )
        );

        add_action(
            'load-'.$hook_suffix,
            array(
                $this,
                'load_assets'
            )
         );
    }

    public function load_view($view)
    {
        $path = trailingslashit( $this->views_dir ).$view;

        if(file_exists($path)){
            include $path;
        }
    }

    public function load_admin_view() {
        $this->load_view('admin.php');
    }

    public function load_assets() {
        wp_register_script( 
            $this->plugin_domain . '-bundle', 
            plugin_dir_url(__FILE__) . 'dist/bundle.js', 
            array(), 
            false,
            'all'
        );

        wp_localize_script( 
            $this->plugin_domain . '-bundle', 
            'wpApiSettings', 
            array(
                'root' => esc_url_raw( rest_url()),
                'nonce' => wp_create_nonce( 'wp_rest' ),
                'wprb_ajax_base' => defined('WPRB_AJAX_BASE') ? WPRB_AJAX_BASE : '',
                'wprb_basic_auth' => defined('WPRB_AJAX_BASIC_AUTH') ? WPRB_AJAX_BASIX_AUTH : null,
            ));

            wp_enqueue_script( $this->plugin_domain . '-bundle' );
            wp_add_inline_script( $this->plugin_domain . '-bundle', '', 'before');
            wp_enqueue_style( $this->plugin_domain . '-bundle-styles', plugin_dir_url( __FILE__ ) . 'dist/style.bundle.css', array(), null,'all' );
    }
}

new WP_Botframework_Press();