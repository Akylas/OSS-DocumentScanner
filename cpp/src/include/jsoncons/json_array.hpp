// Copyright 2013-2023 Daniel Parker
// Distributed under the Boost license, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

// See https://github.com/danielaparker/jsoncons for latest version

#ifndef JSONCONS_JSON_ARRAY_HPP
#define JSONCONS_JSON_ARRAY_HPP

#include <string>
#include <vector>
#include <exception>
#include <cstring>
#include <algorithm> // std::sort, std::stable_sort, std::lower_bound, std::unique
#include <utility>
#include <initializer_list>
#include <iterator> // std::iterator_traits
#include <memory> // std::allocator
#include <utility> // std::move
#include <cassert> // assert
#include <type_traits> // std::enable_if
#include <jsoncons/json_exception.hpp>
#include <jsoncons/allocator_holder.hpp>

namespace jsoncons {

    // json_array

    template <class Json,template<typename,typename> class SequenceContainer = std::vector>
    class json_array : public allocator_holder<typename Json::allocator_type>
    {
    public:
        using allocator_type = typename Json::allocator_type;
        using value_type = Json;
    private:
        using value_allocator_type = typename std::allocator_traits<allocator_type>:: template rebind_alloc<value_type>;                   
        using value_container_type = SequenceContainer<value_type,value_allocator_type>;
        value_container_type elements_;
    public:
        using iterator = typename value_container_type::iterator;
        using const_iterator = typename value_container_type::const_iterator;
        using reference = typename std::iterator_traits<iterator>::reference;
        using const_reference = typename std::iterator_traits<const_iterator>::reference;

        using allocator_holder<allocator_type>::get_allocator;

        json_array()
        {
        }

        explicit json_array(const allocator_type& alloc)
            : allocator_holder<allocator_type>(alloc), 
              elements_(value_allocator_type(alloc))
        {
        }

        explicit json_array(std::size_t n, 
                            const allocator_type& alloc = allocator_type())
            : allocator_holder<allocator_type>(alloc), 
              elements_(n,Json(),value_allocator_type(alloc))
        {
        }

        explicit json_array(std::size_t n, 
                            const Json& value, 
                            const allocator_type& alloc = allocator_type())
            : allocator_holder<allocator_type>(alloc), 
              elements_(n,value,value_allocator_type(alloc))
        {
        }

        template <class InputIterator>
        json_array(InputIterator begin, InputIterator end, const allocator_type& alloc = allocator_type())
            : allocator_holder<allocator_type>(alloc), 
              elements_(begin,end,value_allocator_type(alloc))
        {
        }

        json_array(const json_array& other)
            : allocator_holder<allocator_type>(other.get_allocator()),
              elements_(other.elements_)
        {
        }
        json_array(const json_array& other, const allocator_type& alloc)
            : allocator_holder<allocator_type>(alloc), 
              elements_(other.elements_,value_allocator_type(alloc))
        {
        }

        json_array(json_array&& other) noexcept
            : allocator_holder<allocator_type>(other.get_allocator()), 
              elements_(std::move(other.elements_))
        {
        }
        json_array(json_array&& other, const allocator_type& alloc)
            : allocator_holder<allocator_type>(alloc), 
              elements_(std::move(other.elements_),value_allocator_type(alloc))
        {
        }

        json_array(const std::initializer_list<Json>& init, 
                   const allocator_type& alloc = allocator_type())
            : allocator_holder<allocator_type>(alloc), 
              elements_(init,value_allocator_type(alloc))
        {
        }
        ~json_array() noexcept
        {
            flatten_and_destroy();
        }

        reference back()
        {
            return elements_.back();
        }

        const_reference back() const
        {
            return elements_.back();
        }

        void pop_back()
        {
            elements_.pop_back();
        }

        bool empty() const
        {
            return elements_.empty();
        }

        void swap(json_array& other) noexcept
        {
            elements_.swap(other.elements_);
        }

        std::size_t size() const {return elements_.size();}

        std::size_t capacity() const {return elements_.capacity();}

        void clear() {elements_.clear();}

        void shrink_to_fit() 
        {
            for (std::size_t i = 0; i < elements_.size(); ++i)
            {
                elements_[i].shrink_to_fit();
            }
            elements_.shrink_to_fit();
        }

        void reserve(std::size_t n) {elements_.reserve(n);}

        void resize(std::size_t n) {elements_.resize(n);}

        void resize(std::size_t n, const Json& val) {elements_.resize(n,val);}

    #if !defined(JSONCONS_NO_DEPRECATED)
        JSONCONS_DEPRECATED_MSG("Instead, use erase(const_iterator, const_iterator)")
        void remove_range(std::size_t from_index, std::size_t to_index) 
        {
            JSONCONS_ASSERT(from_index <= to_index);
            JSONCONS_ASSERT(to_index <= elements_.size());
            elements_.erase(elements_.cbegin()+from_index,elements_.cbegin()+to_index);
        }
    #endif

        iterator erase(const_iterator pos) 
        {
    #if defined(JSONCONS_NO_VECTOR_ERASE_TAKES_CONST_ITERATOR)
            iterator it = elements_.begin() + (pos - elements_.begin());
            return elements_.erase(it);
    #else
            return elements_.erase(pos);
    #endif
        }

        iterator erase(const_iterator first, const_iterator last) 
        {
    #if defined(JSONCONS_NO_VECTOR_ERASE_TAKES_CONST_ITERATOR)
            iterator it1 = elements_.begin() + (first - elements_.begin());
            iterator it2 = elements_.begin() + (last - elements_.begin());
            return elements_.erase(it1,it2);
    #else
            return elements_.erase(first,last);
    #endif
        }

        Json& operator[](std::size_t i) {return elements_[i];}

        const Json& operator[](std::size_t i) const {return elements_[i];}

        // push_back

        template <class T, class A=allocator_type>
        typename std::enable_if<extension_traits::is_stateless<A>::value,void>::type 
        push_back(T&& value)
        {
            elements_.emplace_back(std::forward<T>(value));
        }

        template <class T, class A=allocator_type>
        typename std::enable_if<!extension_traits::is_stateless<A>::value,void>::type 
        push_back(T&& value)
        {
            elements_.emplace_back(std::forward<T>(value));
        }

        template <class T, class A=allocator_type>
        typename std::enable_if<extension_traits::is_stateless<A>::value,iterator>::type 
        insert(const_iterator pos, T&& value)
        {
    #if defined(JSONCONS_NO_VECTOR_ERASE_TAKES_CONST_ITERATOR)
            iterator it = elements_.begin() + (pos - elements_.begin());
            return elements_.emplace(it, std::forward<T>(value));
    #else
            return elements_.emplace(pos, std::forward<T>(value));
    #endif
        }
        template <class T, class A=allocator_type>
        typename std::enable_if<!extension_traits::is_stateless<A>::value,iterator>::type 
        insert(const_iterator pos, T&& value)
        {
    #if defined(JSONCONS_NO_VECTOR_ERASE_TAKES_CONST_ITERATOR)
            iterator it = elements_.begin() + (pos - elements_.begin());
            return elements_.emplace(it, std::forward<T>(value));
    #else
            return elements_.emplace(pos, std::forward<T>(value));
    #endif
        }

        template <class InputIt>
        iterator insert(const_iterator pos, InputIt first, InputIt last)
        {
    #if defined(JSONCONS_NO_VECTOR_ERASE_TAKES_CONST_ITERATOR)
            iterator it = elements_.begin() + (pos - elements_.begin());
            elements_.insert(it, first, last);
            return first == last ? it : it + 1;
    #else
            return elements_.insert(pos, first, last);
    #endif
        }

        template <class A=allocator_type, class... Args>
        typename std::enable_if<extension_traits::is_stateless<A>::value,iterator>::type 
        emplace(const_iterator pos, Args&&... args)
        {
    #if defined(JSONCONS_NO_VECTOR_ERASE_TAKES_CONST_ITERATOR)
            iterator it = elements_.begin() + (pos - elements_.begin());
            return elements_.emplace(it, std::forward<Args>(args)...);
    #else
            return elements_.emplace(pos, std::forward<Args>(args)...);
    #endif
        }

        template <class... Args>
        Json& emplace_back(Args&&... args)
        {
            elements_.emplace_back(std::forward<Args>(args)...);
            return elements_.back();
        }

        iterator begin() {return elements_.begin();}

        iterator end() {return elements_.end();}

        const_iterator begin() const {return elements_.begin();}

        const_iterator end() const {return elements_.end();}

        bool operator==(const json_array& rhs) const noexcept
        {
            return elements_ == rhs.elements_;
        }

        bool operator<(const json_array& rhs) const noexcept
        {
            return elements_ < rhs.elements_;
        }
    private:

        json_array& operator=(const json_array&) = delete;

        void flatten_and_destroy() noexcept
        {
            while (!elements_.empty())
            {
                value_type current = std::move(elements_.back());
                elements_.pop_back();
                switch (current.storage_kind())
                {
                    case json_storage_kind::array_value:
                    {
                        for (auto&& item : current.array_range())
                        {
                            if (item.size() > 0) // non-empty object or array
                            {
                                elements_.push_back(std::move(item));
                            }
                        }
                        current.clear();                           
                        break;
                    }
                    case json_storage_kind::object_value:
                    {
                        for (auto&& kv : current.object_range())
                        {
                            if (kv.value().size() > 0) // non-empty object or array
                            {
                                elements_.push_back(std::move(kv.value()));
                            }
                        }
                        current.clear();                           
                        break;
                    }
                    default:
                        break;
                }
            }
        }
    };

} // namespace jsoncons

#endif
