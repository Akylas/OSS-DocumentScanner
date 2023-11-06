// Copyright 2013-2023 Daniel Parker
// Distributed under the Boost license, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

// See https://github.com/danielaparker/jsoncons for latest version

#ifndef JSONCONS_JSON_OBJECT_HPP
#define JSONCONS_JSON_OBJECT_HPP

#include <string>
#include <vector>
#include <tuple>
#include <exception>
#include <cstring>
#include <algorithm> // std::sort, std::stable_sort, std::lower_bound, std::unique
#include <utility>
#include <initializer_list>
#include <iterator> // std::iterator_traits
#include <memory> // std::allocator
#include <utility> // std::move
#include <cassert> // assert
#include <unordered_set>
#include <type_traits> // std::enable_if
#include <jsoncons/json_exception.hpp>
#include <jsoncons/allocator_holder.hpp>
#include <jsoncons/json_array.hpp>

namespace jsoncons {

    template <class Json>
    struct index_key_value
    {
        using key_type = typename Json::key_type;
        using allocator_type = typename Json::allocator_type;

        key_type name;
        int64_t index;
        Json value;

        template <class... Args>
        index_key_value(key_type&& Name, int64_t Index, Args&& ... args) 
            : name(std::move(Name)), index(Index), value(std::forward<Args>(args)...)
        {
        }

        index_key_value() = default;
        index_key_value(const index_key_value&) = default;
        index_key_value(index_key_value&&) = default;
        index_key_value(const index_key_value& other, const allocator_type& alloc) 
            : name(other.name, alloc), index(0), value(other.value, alloc) 
        {
        }
        index_key_value(index_key_value&& other, const allocator_type& alloc)
            : name(std::move(other.name), alloc), index(0), value(std::move(other.value), alloc) 
        {

        }
        index_key_value& operator=(const index_key_value&) = default;
        index_key_value& operator=(index_key_value&&) = default;
    };

    struct sorted_unique_range_tag
    {
        explicit sorted_unique_range_tag() = default; 
    };

    // key_value

    template <class KeyT, class ValueT>
    class key_value
    {
    public:
        using key_type = KeyT;
        using value_type = ValueT;
        using string_view_type = typename value_type::string_view_type;
        using allocator_type = typename ValueT::allocator_type;
    private:

        key_type key_;
        value_type value_;
    public:

        key_value() noexcept
        {
        }

        key_value(const key_type& name, const value_type& val)
            : key_(name), value_(val)
        {
        }

        key_value(const string_view_type& name)
            : key_(name)
        {
        }

        template <typename... Args>
        key_value(const key_type& name,  Args&& ... args)
            : key_(name), value_(std::forward<Args>(args)...)
        {
        }

        template <typename... Args>
        key_value(key_type&& name,  Args&& ... args) noexcept
            : key_(std::move(name)), value_(std::forward<Args>(args)...)
        {
        }

        template <typename... Args>
        key_value(const key_type& name,  Args&& ... args, const allocator_type& alloc)
            : key_(name, alloc), value_(std::forward<Args>(args)..., alloc)
        {
        }

        template <typename... Args>
        key_value(key_type&& name,  Args&& ... args, const allocator_type& alloc) noexcept
            : key_(std::move(name),alloc), value_(std::forward<Args>(args)...,alloc)
        {
        }

        key_value(const key_value& member)
            : key_(member.key_), value_(member.value_)
        {
        }

        key_value(const key_value& member, const allocator_type& alloc)
            : key_(member.key_, alloc), value_(member.value_, alloc)
        {
        }

        key_value(key_value&& member) noexcept
            : key_(std::move(member.key_)), value_(std::move(member.value_))
        {
        }

        key_value(key_value&& member, const allocator_type& alloc) noexcept
            : key_(std::move(member.key_), alloc), value_(std::move(member.value_), alloc)
        {
        }

        template <typename... U1, typename... U2>
        JSONCONS_CONSTEXPR key_value(std::piecewise_construct_t /*unused*/, std::tuple<U1...> a,
                 std::tuple<U2...>
                     b) noexcept(noexcept(key_value(std::declval<std::tuple<U1...>&>(),
                                               std::declval<std::tuple<U2...>&>(),
                                               jsoncons::extension_traits::index_sequence_for<U1...>(),
                                               jsoncons::extension_traits::index_sequence_for<U2...>())))
            : key_value(a, b, jsoncons::extension_traits::index_sequence_for<U1...>(),
                   jsoncons::extension_traits::index_sequence_for<U2...>()) {
        }

        template <typename... U1, size_t... I1, typename... U2, size_t... I2>
        key_value(std::tuple<U1...>& a, std::tuple<U2...>& b, jsoncons::extension_traits::index_sequence<I1...> /*unused*/, jsoncons::extension_traits::index_sequence<I2...> /*unused*/) noexcept(
            noexcept(KeyT(std::forward<U1>(std::get<I1>(
                std::declval<std::tuple<
                    U1...>&>()))...)) && noexcept(ValueT(std::
                                                         forward<U2>(std::get<I2>(
                                                             std::declval<std::tuple<U2...>&>()))...)))
            : key_(std::forward<U1>(std::get<I1>(a))...)
            , value_(std::forward<U2>(std::get<I2>(b))...) {
            // make visual studio compiler happy about warning about unused a & b.
            // Visual studio's key_value implementation disables warning 4100.
            (void)a;
            (void)b;
        }

        const key_type& key() const
        {
            return key_;
        }

        value_type& value()
        {
            return value_;
        }

        const value_type& value() const
        {
            return value_;
        }

        template <class T>
        void value(T&& newValue)
        {
            value_ = std::forward<T>(newValue);
        }

        void swap(key_value& member) noexcept
        {
            key_.swap(member.key_);
            value_.swap(member.value_);
        }

        key_value& operator=(const key_value& member)
        {
            if (this != & member)
            {
                key_ = member.key_;
                value_ = member.value_;
            }
            return *this;
        }

        key_value& operator=(key_value&& member) noexcept
        {
            if (this != &member)
            {
                key_.swap(member.key_);
                value_.swap(member.value_);
            }
            return *this;
        }

        void shrink_to_fit() 
        {
            key_.shrink_to_fit();
            value_.shrink_to_fit();
        }
    #if !defined(JSONCONS_NO_DEPRECATED)
        JSONCONS_DEPRECATED_MSG("Instead, use key()")
        const key_type& name() const
        {
            return key_;
        }
    #endif

        friend bool operator==(const key_value& lhs, const key_value& rhs) noexcept
        {
            return lhs.key_ == rhs.key_ && lhs.value_ == rhs.value_;
        }

        friend bool operator!=(const key_value& lhs, const key_value& rhs) noexcept
        {
            return !(lhs == rhs);
        }

        friend bool operator<(const key_value& lhs, const key_value& rhs) noexcept
        {
            if (lhs.key_ < rhs.key_)
            {
                return true;
            }
            if (lhs.key_ == rhs.key_ && lhs.value_ < rhs.value_)
            {
                return true;
            }
            return false;
        }

        friend bool operator<=(const key_value& lhs, const key_value& rhs) noexcept
        {
            return !(rhs < lhs);
        }

        friend bool operator>(const key_value& lhs, const key_value& rhs) noexcept
        {
            return !(lhs <= rhs);
        }

        friend bool operator>=(const key_value& lhs, const key_value& rhs) noexcept
        {
            return !(lhs < rhs);
        }

        friend void swap(key_value& a, key_value& b) noexcept(
            noexcept(std::declval<key_value&>().swap(std::declval<key_value&>()))) 
        {
            a.swap(b);
        }
    };

    template <class KeyT, class ValueT>
    struct get_key_value
    {
        using key_value_type = key_value<KeyT,ValueT>;

        template <class T1,class T2>
        key_value_type operator()(const std::pair<T1,T2>& p)
        {
            return key_value_type(p.first,p.second);
        }
        template <class T1,class T2>
        key_value_type operator()(std::pair<T1,T2>&& p)
        {
            return key_value_type(std::forward<T1>(p.first),std::forward<T2>(p.second));
        }
        template <class T1,class T2>
        const key_value_type& operator()(const key_value<T1,T2>& p)
        {
            return p;
        }
        template <class T1,class T2>
        key_value_type operator()(key_value<T1,T2>&& p)
        {
            return std::move(p);
        }
    };

    struct sort_key_order
    {
        explicit sort_key_order() = default; 
    };

    struct preserve_key_order
    {
        explicit preserve_key_order() = default; 
    };


    // Sort keys
    template <class KeyT,class Json,template<typename,typename> class SequenceContainer = std::vector>
    class sorted_json_object : public allocator_holder<typename Json::allocator_type>    
    {
    public:
        using allocator_type = typename Json::allocator_type;
        using key_type = KeyT;
        using key_value_type = key_value<KeyT,Json>;
        using char_type = typename Json::char_type;
        using string_view_type = typename Json::string_view_type;
    private:
        struct Comp
        {
            bool operator() (const key_value_type& kv, string_view_type k) const { return kv.key() < k; }
            bool operator() (string_view_type k, const key_value_type& kv) const { return k < kv.key(); }
        };

        using key_value_allocator_type = typename std::allocator_traits<allocator_type>:: template rebind_alloc<key_value_type>;
        using key_value_container_type = SequenceContainer<key_value_type,key_value_allocator_type>;

        key_value_container_type members_;
    public:
        using iterator = typename key_value_container_type::iterator;
        using const_iterator = typename key_value_container_type::const_iterator;

        using allocator_holder<allocator_type>::get_allocator;

        sorted_json_object()
        {
        }

        explicit sorted_json_object(const allocator_type& alloc)
            : allocator_holder<allocator_type>(alloc), 
              members_(key_value_allocator_type(alloc))
        {
        }

        sorted_json_object(const sorted_json_object& other)
            : allocator_holder<allocator_type>(other.get_allocator()),
              members_(other.members_)
        {
        }

        sorted_json_object(const sorted_json_object& other, const allocator_type& alloc) 
            : allocator_holder<allocator_type>(alloc), 
              members_(other.members_,key_value_allocator_type(alloc))
        {
        }

        sorted_json_object(sorted_json_object&& other) noexcept
            : allocator_holder<allocator_type>(other.get_allocator()), 
              members_(std::move(other.members_))
        {
        }

        sorted_json_object(sorted_json_object&& other,const allocator_type& alloc) 
            : allocator_holder<allocator_type>(alloc), members_(std::move(other.members_),key_value_allocator_type(alloc))
        {
        }

        sorted_json_object& operator=(const sorted_json_object& other)
        {
            allocator_holder<allocator_type>::operator=(other.get_allocator());
            members_ = other.members_;
            return *this;
        }

        sorted_json_object& operator=(sorted_json_object&& other)
        {
            other.swap(*this);
            return *this;
        }

        template<class InputIt>
        sorted_json_object(InputIt first, InputIt last)
        {
            std::size_t count = std::distance(first,last);
            members_.reserve(count);
            for (auto s = first; s != last; ++s)
            {
                members_.emplace_back(get_key_value<KeyT,Json>()(*s));
            }
            std::stable_sort(members_.begin(),members_.end(),
                             [](const key_value_type& a, const key_value_type& b) -> bool {return a.key().compare(b.key()) < 0;});
            auto it = std::unique(members_.begin(), members_.end(),
                                  [](const key_value_type& a, const key_value_type& b) -> bool { return !(a.key().compare(b.key()));});
            members_.erase(it, members_.end());
        }

        template<class InputIt>
        sorted_json_object(InputIt first, InputIt last, 
                    const allocator_type& alloc)
            : allocator_holder<allocator_type>(alloc), 
              members_(key_value_allocator_type(alloc))
        {
            std::size_t count = std::distance(first,last);
            members_.reserve(count);
            for (auto s = first; s != last; ++s)
            {
                members_.emplace_back(get_key_value<KeyT,Json>()(*s));
            }
            std::stable_sort(members_.begin(),members_.end(),
                             [](const key_value_type& a, const key_value_type& b) -> bool {return a.key().compare(b.key()) < 0;});
            auto it = std::unique(members_.begin(), members_.end(),
                                  [](const key_value_type& a, const key_value_type& b) -> bool { return !(a.key().compare(b.key()));});
            members_.erase(it, members_.end());
        }

        sorted_json_object(const std::initializer_list<std::pair<std::basic_string<char_type>,Json>>& init, 
                    const allocator_type& alloc = allocator_type())
            : allocator_holder<allocator_type>(alloc), 
              members_(key_value_allocator_type(alloc))
        {
            members_.reserve(init.size());
            for (auto& item : init)
            {
                insert_or_assign(item.first, item.second);
            }
        }

        ~sorted_json_object() noexcept
        {
            flatten_and_destroy();
        }

        bool empty() const
        {
            return members_.empty();
        }

        void swap(sorted_json_object& other) noexcept
        {
            members_.swap(other.members_);
        }

        iterator begin()
        {
            return members_.begin();
        }

        iterator end()
        {
            return members_.end();
        }

        const_iterator begin() const
        {
            return members_.begin();
        }

        const_iterator end() const
        {
            return members_.end();
        }

        std::size_t size() const {return members_.size();}

        std::size_t capacity() const {return members_.capacity();}

        void clear() {members_.clear();}

        void shrink_to_fit() 
        {
            for (std::size_t i = 0; i < members_.size(); ++i)
            {
                members_[i].shrink_to_fit();
            }
            members_.shrink_to_fit();
        }

        void reserve(std::size_t n) {members_.reserve(n);}

        Json& at(std::size_t i) 
        {
            if (i >= members_.size())
            {
                JSONCONS_THROW(json_runtime_error<std::out_of_range>("Invalid array subscript"));
            }
            return members_[i].value();
        }

        const Json& at(std::size_t i) const 
        {
            if (i >= members_.size())
            {
                JSONCONS_THROW(json_runtime_error<std::out_of_range>("Invalid array subscript"));
            }
            return members_[i].value();
        }

        iterator find(const string_view_type& name) noexcept
        {
            auto p = std::equal_range(members_.begin(),members_.end(), name, 
                                       Comp());        
            return p.first == p.second ? members_.end() : p.first;
        }

        const_iterator find(const string_view_type& name) const noexcept
        {
            auto p = std::equal_range(members_.begin(),members_.end(), name, 
                                       Comp());        
            return p.first == p.second ? members_.end() : p.first;
        }

        iterator erase(const_iterator pos) 
        {
    #if defined(JSONCONS_NO_VECTOR_ERASE_TAKES_CONST_ITERATOR)
            iterator it = members_.begin() + (pos - members_.begin());
            return members_.erase(it);
    #else
            return members_.erase(pos);
    #endif
        }

        iterator erase(const_iterator first, const_iterator last) 
        {
    #if defined(JSONCONS_NO_VECTOR_ERASE_TAKES_CONST_ITERATOR)
            iterator it1 = members_.begin() + (first - members_.begin());
            iterator it2 = members_.begin() + (last - members_.begin());
            return members_.erase(it1,it2);
    #else
            return members_.erase(first,last);
    #endif
        }

        void erase(const string_view_type& name) 
        {
            auto it = find(name);
            if (it != members_.end())
            {
                members_.erase(it);
            }
        }

        static bool compare(const index_key_value<Json>& item1, const index_key_value<Json>& item2)
        {
            int comp = item1.name.compare(item2.name); 
            if (comp < 0) return true;
            if (comp == 0) return item1.index < item2.index;

            return false;
        }

        void uninitialized_init(index_key_value<Json>* items, std::size_t count)
        {
            auto first = items;
            if (count > 0)
            {
                members_.reserve(count);

                auto last = first + count;

                std::sort(first, last, compare);
                members_.emplace_back(first->name, std::move(first->value));
                auto prev_it = first;
                for (auto it = first+1; it != last; ++it)
                {
                    if (it->name != prev_it->name)
                    {
                        members_.emplace_back(it->name, std::move(it->value));
                    }
                    ++prev_it;
                }
            }
        }

        template<class InputIt>
        void insert(InputIt first, InputIt last)
        {
            for (auto s = first; s != last; ++s)
            {
                members_.emplace_back(get_key_value<KeyT,Json>()(*s));
            }
            std::stable_sort(members_.begin(),members_.end(),
                             [](const key_value_type& a, const key_value_type& b) -> bool {return a.key().compare(b.key()) < 0;});
            auto it = std::unique(members_.begin(), members_.end(),
                                  [](const key_value_type& a, const key_value_type& b) -> bool { return !(a.key().compare(b.key()));});
            members_.erase(it, members_.end());
        }

        template<class InputIt>
        void insert(sorted_unique_range_tag, InputIt first, InputIt last)
        {
            if (first != last)
            {
                auto it = find(convert(*first).key());
                if (it != members_.end())
                {
                    for (auto s = first; s != last; ++s)
                    {
                        it = members_.emplace(it, get_key_value<KeyT,Json>()(*s));
                    }
                }
                else
                {
                    for (auto s = first; s != last; ++s)
                    {
                        members_.emplace_back(convert(*s));
                    }
                }
            }
        }

        // insert_or_assign

        template <class T, class A=allocator_type>
        typename std::enable_if<extension_traits::is_stateless<A>::value,std::pair<iterator,bool>>::type
        insert_or_assign(const string_view_type& name, T&& value)
        {
            bool inserted;
            auto it = std::lower_bound(members_.begin(),members_.end(), name, Comp());        
            if (it == members_.end())
            {
                members_.emplace_back(key_type(name.begin(),name.end()), std::forward<T>(value));
                inserted = true;
                it = members_.begin() + members_.size() - 1;
            }
            else if (it->key() == name)
            {
                it->value(Json(std::forward<T>(value)));
                inserted = false; // assigned
            }
            else
            {
                it = members_.emplace(it, key_type(name.begin(),name.end()), std::forward<T>(value));
                inserted = true;
            }
            return std::make_pair(it,inserted);
        }

        template <class T, class A=allocator_type>
        typename std::enable_if<!extension_traits::is_stateless<A>::value,std::pair<iterator,bool>>::type
        insert_or_assign(const string_view_type& name, T&& value)
        {
            bool inserted;
            auto it = std::lower_bound(members_.begin(),members_.end(), name, 
                                       Comp());        
            if (it == members_.end())
            {
                members_.emplace_back(key_type(name.begin(),name.end(), get_allocator()), std::forward<T>(value));
                inserted = true;
                it = members_.begin() + members_.size() - 1;
            }
            else if (it->key() == name)
            {
                it->value(Json(std::forward<T>(value), get_allocator()));
                inserted = false; // assigned
            }
            else
            {
                it = members_.emplace(it, key_type(name.begin(),name.end(), get_allocator()),
                    std::forward<T>(value));
                inserted = true;
            }
            return std::make_pair(it,inserted);
        }

        // try_emplace

        template <class A=allocator_type, class... Args>
        typename std::enable_if<extension_traits::is_stateless<A>::value,std::pair<iterator,bool>>::type
        try_emplace(const string_view_type& name, Args&&... args)
        {
            bool inserted;
            auto it = std::lower_bound(members_.begin(),members_.end(), name, 
                                       Comp());        
            if (it == members_.end())
            {
                members_.emplace_back(key_type(name.begin(),name.end()), std::forward<Args>(args)...);
                it = members_.begin() + members_.size() - 1;
                inserted = true;
            }
            else if (it->key() == name)
            {
                inserted = false;
            }
            else
            {
                it = members_.emplace(it, key_type(name.begin(),name.end()),
                                            std::forward<Args>(args)...);
                inserted = true;
            }
            return std::make_pair(it,inserted);
        }

        template <class A=allocator_type, class... Args>
        typename std::enable_if<!extension_traits::is_stateless<A>::value,std::pair<iterator,bool>>::type
        try_emplace(const string_view_type& name, Args&&... args)
        {
            bool inserted;
            auto it = std::lower_bound(members_.begin(),members_.end(), name, 
                                       Comp());        
            if (it == members_.end())
            {
                members_.emplace_back(key_type(name.begin(),name.end(), get_allocator()), std::forward<Args>(args)...);
                it = members_.begin() + members_.size() - 1;
                inserted = true;
            }
            else if (it->key() == name)
            {
                inserted = false;
            }
            else
            {
                it = members_.emplace(it,
                                            key_type(name.begin(),name.end(), get_allocator()),
                                            std::forward<Args>(args)...);
                inserted = true;
            }
            return std::make_pair(it,inserted);
        }

        template <class A=allocator_type, class ... Args>
        typename std::enable_if<extension_traits::is_stateless<A>::value,iterator>::type 
        try_emplace(iterator hint, const string_view_type& name, Args&&... args)
        {
            iterator it = hint;

            if (hint != members_.end() && hint->key() <= name)
            {
                it = std::lower_bound(hint,members_.end(), name, 
                                      Comp());        
            }
            else
            {
                it = std::lower_bound(members_.begin(),members_.end(), name, 
                                      Comp());        
            }

            if (it == members_.end())
            {
                members_.emplace_back(key_type(name.begin(),name.end()), 
                    std::forward<Args>(args)...);
                it = members_.begin() + (members_.size() - 1);
            }
            else if (it->key() == name)
            {
            }
            else
            {
                it = members_.emplace(it,
                                            key_type(name.begin(),name.end()),
                                            std::forward<Args>(args)...);
            }

            return it;
        }

        template <class A=allocator_type, class ... Args>
        typename std::enable_if<!extension_traits::is_stateless<A>::value,iterator>::type 
        try_emplace(iterator hint, const string_view_type& name, Args&&... args)
        {
            iterator it = hint;
            if (hint != members_.end() && hint->key() <= name)
            {
                it = std::lower_bound(hint,members_.end(), name, 
                                      Comp());        
            }
            else
            {
                it = std::lower_bound(members_.begin(),members_.end(), name, 
                                      Comp());        
            }

            if (it == members_.end())
            {
                members_.emplace_back(key_type(name.begin(),name.end(), get_allocator()), 
                    std::forward<Args>(args)...);
                it = members_.begin() + (members_.size() - 1);
            }
            else if (it->key() == name)
            {
            }
            else
            {
                it = members_.emplace(it,
                                            key_type(name.begin(),name.end(), get_allocator()),
                                            std::forward<Args>(args)...);
            }
            return it;
        }

        // insert_or_assign

        template <class T, class A=allocator_type>
        typename std::enable_if<extension_traits::is_stateless<A>::value,iterator>::type 
        insert_or_assign(iterator hint, const string_view_type& name, T&& value)
        {
            iterator it;
            if (hint != members_.end() && hint->key() <= name)
            {
                it = std::lower_bound(hint,members_.end(), name, 
                                      [](const key_value_type& a, const string_view_type& k) -> bool {return string_view_type(a.key()).compare(k) < 0;});        
            }
            else
            {
                it = std::lower_bound(members_.begin(),members_.end(), name, 
                                      [](const key_value_type& a, const string_view_type& k) -> bool {return string_view_type(a.key()).compare(k) < 0;});        
            }

            if (it == members_.end())
            {
                members_.emplace_back(key_type(name.begin(),name.end()), std::forward<T>(value));
                it = members_.begin() + (members_.size() - 1);
            }
            else if (it->key() == name)
            {
                it->value(Json(std::forward<T>(value)));
            }
            else
            {
                it = members_.emplace(it, key_type(name.begin(),name.end()), std::forward<T>(value));
            }
            return it;
        }

        template <class T, class A=allocator_type>
        typename std::enable_if<!extension_traits::is_stateless<A>::value,iterator>::type 
        insert_or_assign(iterator hint, const string_view_type& name, T&& value)
        {
            iterator it;
            if (hint != members_.end() && hint->key() <= name)
            {
                it = std::lower_bound(hint,members_.end(), name, 
                                      Comp());        
            }
            else
            {
                it = std::lower_bound(members_.begin(),members_.end(), name, 
                                      Comp());        
            }

            if (it == members_.end())
            {
                members_.emplace_back(key_type(name.begin(),name.end(), get_allocator()), std::forward<T>(value));
                it = members_.begin() + (members_.size() - 1);
            }
            else if (it->key() == name)
            {
                it->value(Json(std::forward<T>(value),get_allocator()));
            }
            else
            {
                it = members_.emplace(it, key_type(name.begin(),name.end(), get_allocator()),
                    std::forward<T>(value));
            }
            return it;
        }

        // merge

        void merge(const sorted_json_object& source)
        {
            for (auto it = source.begin(); it != source.end(); ++it)
            {
                try_emplace(it->key(),it->value());
            }
        }

        void merge(sorted_json_object&& source)
        {
            auto it = std::make_move_iterator(source.begin());
            auto end = std::make_move_iterator(source.end());
            for (; it != end; ++it)
            {
                auto pos = std::lower_bound(members_.begin(),members_.end(), (*it).key(), 
                                            Comp());   
                if (pos == members_.end() )
                {
                    members_.emplace_back(*it);
                }
                else if ((*it).key() != pos->key())
                {
                    members_.emplace(pos,*it);
                }
            }
        }

        void merge(iterator hint, const sorted_json_object& source)
        {
            for (auto it = source.begin(); it != source.end(); ++it)
            {
                hint = try_emplace(hint, (*it).key(),(*it).value());
            }
        }

        void merge(iterator hint, sorted_json_object&& source)
        {
            auto it = std::make_move_iterator(source.begin());
            auto end = std::make_move_iterator(source.end());
            for (; it != end; ++it)
            {
                iterator pos;
                if (hint != members_.end() && hint->key() <= (*it).key())
                {
                    pos = std::lower_bound(hint,members_.end(), (*it).key(), 
                                          Comp());        
                }
                else
                {
                    pos = std::lower_bound(members_.begin(),members_.end(), (*it).key(), 
                                          Comp());        
                }
                if (pos == members_.end() )
                {
                    members_.emplace_back(*it);
                    hint = members_.begin() + (members_.size() - 1);
                }
                else if ((*it).key() != pos->key())
                {
                    hint = members_.emplace(pos,*it);
                }
            }
        }

        // merge_or_update

        void merge_or_update(const sorted_json_object& source)
        {
            for (auto it = source.begin(); it != source.end(); ++it)
            {
                insert_or_assign((*it).key(),(*it).value());
            }
        }

        void merge_or_update(sorted_json_object&& source)
        {
            auto it = std::make_move_iterator(source.begin());
            auto end = std::make_move_iterator(source.end());
            for (; it != end; ++it)
            {
                auto pos = std::lower_bound(members_.begin(),members_.end(), (*it).key(), 
                                            Comp());   
                if (pos == members_.end() )
                {
                    members_.emplace_back(*it);
                }
                else 
                {
                    pos->value((*it).value());
                }
            }
        }

        void merge_or_update(iterator hint, const sorted_json_object& source)
        {
            for (auto it = source.begin(); it != source.end(); ++it)
            {
                hint = insert_or_assign(hint, (*it).key(),(*it).value());
            }
        }

        void merge_or_update(iterator hint, sorted_json_object&& source)
        {
            auto it = std::make_move_iterator(source.begin());
            auto end = std::make_move_iterator(source.end());
            for (; it != end; ++it)
            {
                iterator pos;
                if (hint != members_.end() && hint->key() <= (*it).key())
                {
                    pos = std::lower_bound(hint,members_.end(), (*it).key(), 
                                          Comp());        
                }
                else
                {
                    pos = std::lower_bound(members_.begin(),members_.end(), (*it).key(), 
                                          Comp());        
                }
                if (pos == members_.end() )
                {
                    members_.emplace_back(*it);
                    hint = members_.begin() + (members_.size() - 1);
                }
                else 
                {
                    pos->value((*it).value());
                    hint = pos;
                }
            }
        }

        bool operator==(const sorted_json_object& rhs) const
        {
            return members_ == rhs.members_;
        }

        bool operator<(const sorted_json_object& rhs) const
        {
            return members_ < rhs.members_;
        }
    private:

        void flatten_and_destroy() noexcept
        {
            if (!members_.empty())
            {
                json_array<Json> temp(get_allocator());

                for (auto& kv : members_)
                {
                    switch (kv.value().storage_kind())
                    {
                        case json_storage_kind::array_value:
                        case json_storage_kind::object_value:
                            if (!kv.value().empty())
                            {
                                temp.emplace_back(std::move(kv.value()));
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    };

    // Preserve order
    template <class KeyT,class Json,template<typename,typename> class SequenceContainer = std::vector>
    class order_preserving_json_object : public allocator_holder<typename Json::allocator_type>
    {
    public:
        using allocator_type = typename Json::allocator_type;
        using char_type = typename Json::char_type;
        using key_type = KeyT;
        using string_view_type = typename Json::string_view_type;
        using key_value_type = key_value<KeyT,Json>;
    private:
        struct MyHash
        {
            std::uintmax_t operator()(const key_type& s) const noexcept
            {
                const int p = 31;
                const int m = static_cast<int>(1e9) + 9;
                std::uintmax_t hash_value = 0;
                std::uintmax_t p_pow = 1;
                for (char_type c : s) {
                    hash_value = (hash_value + (c - 'a' + 1) * p_pow) % m;
                    p_pow = (p_pow * p) % m;
                }
                return hash_value;   
            }
        };

        using key_value_allocator_type = typename std::allocator_traits<allocator_type>:: template rebind_alloc<key_value_type>;
        using key_value_container_type = SequenceContainer<key_value_type,key_value_allocator_type>;

        key_value_container_type members_;

        struct Comp
        {
            const key_value_container_type& members_;

            Comp(const key_value_container_type& members_)
                : members_(members_)
            {
            }

            bool operator() (std::size_t i, string_view_type k) const { return members_.at(i).key() < k; }
            bool operator() (string_view_type k, std::size_t i) const { return k < members_.at(i).key(); }
        };
    public:
        using iterator = typename key_value_container_type::iterator;
        using const_iterator = typename key_value_container_type::const_iterator;

        using allocator_holder<allocator_type>::get_allocator;

        order_preserving_json_object()
        {
        }
        order_preserving_json_object(const allocator_type& alloc)
            : allocator_holder<allocator_type>(alloc), 
              members_(key_value_allocator_type(alloc))
        {
        }

        order_preserving_json_object(const order_preserving_json_object& val)
            : allocator_holder<allocator_type>(val.get_allocator()), 
              members_(val.members_)
        {
        }

        order_preserving_json_object(order_preserving_json_object&& val,const allocator_type& alloc) 
            : allocator_holder<allocator_type>(alloc), 
              members_(std::move(val.members_),key_value_allocator_type(alloc))
        {
        }

        order_preserving_json_object(order_preserving_json_object&& val) noexcept
            : allocator_holder<allocator_type>(val.get_allocator()), 
              members_(std::move(val.members_))
        {
        }

        order_preserving_json_object(const order_preserving_json_object& val, const allocator_type& alloc) 
            : allocator_holder<allocator_type>(alloc), 
              members_(val.members_,key_value_allocator_type(alloc))
        {
        }

        template<class InputIt>
        order_preserving_json_object(InputIt first, InputIt last)
        {
            std::unordered_set<key_type,MyHash> keys;
            for (auto it = first; it != last; ++it)
            {
                auto kv = get_key_value<KeyT,Json>()(*it);
                if (keys.find(kv.key()) == keys.end())
                {
                    keys.emplace(kv.key());
                    members_.emplace_back(std::move(kv));
                }
            }
        }

        template<class InputIt>
        order_preserving_json_object(InputIt first, InputIt last, 
                    const allocator_type& alloc)
            : allocator_holder<allocator_type>(alloc), 
              members_(key_value_allocator_type(alloc))
        {
            std::unordered_set<key_type,MyHash> keys;
            for (auto it = first; it != last; ++it)
            {
                auto kv = get_key_value<KeyT,Json>()(*it);
                if (keys.find(kv.key()) == keys.end())
                {
                    keys.emplace(kv.key());
                    members_.emplace_back(std::move(kv));
                }
            }
        }

        order_preserving_json_object(std::initializer_list<std::pair<std::basic_string<char_type>,Json>> init, 
                    const allocator_type& alloc = allocator_type())
            : allocator_holder<allocator_type>(alloc), 
              members_(key_value_allocator_type(alloc))
        {
            members_.reserve(init.size());
            for (auto& item : init)
            {
                insert_or_assign(item.first, item.second);
            }
        }

        ~order_preserving_json_object() noexcept
        {
            flatten_and_destroy();
        }

        order_preserving_json_object& operator=(order_preserving_json_object&& val)
        {
            val.swap(*this);
            return *this;
        }

        order_preserving_json_object& operator=(const order_preserving_json_object& val)
        {
            allocator_holder<allocator_type>::operator=(val.get_allocator());
            members_ = val.members_;
            return *this;
        }

        void swap(order_preserving_json_object& other) noexcept
        {
            members_.swap(other.members_);
        }

        bool empty() const
        {
            return members_.empty();
        }

        iterator begin()
        {
            return members_.begin();
        }

        iterator end()
        {
            return members_.end();
        }

        const_iterator begin() const
        {
            return members_.begin();
        }

        const_iterator end() const
        {
            return members_.end();
        }

        std::size_t size() const {return members_.size();}

        std::size_t capacity() const {return members_.capacity();}

        void clear() 
        {
            members_.clear();
        }

        void shrink_to_fit() 
        {
            for (std::size_t i = 0; i < members_.size(); ++i)
            {
                members_[i].shrink_to_fit();
            }
            members_.shrink_to_fit();
        }

        void reserve(std::size_t n) {members_.reserve(n);}

        Json& at(std::size_t i) 
        {
            if (i >= members_.size())
            {
                JSONCONS_THROW(json_runtime_error<std::out_of_range>("Invalid array subscript"));
            }
            return members_[i].value();
        }

        const Json& at(std::size_t i) const 
        {
            if (i >= members_.size())
            {
                JSONCONS_THROW(json_runtime_error<std::out_of_range>("Invalid array subscript"));
            }
            return members_[i].value();
        }

        iterator find(const string_view_type& name) noexcept
        {
            bool found = false;
            auto it = members_.begin();
            while (!found && it != members_.end())
            {
                if (it->key() == name)
                {
                    found = true;
                }
                else
                {
                    ++it;
                }
            }
            return it;
        }

        const_iterator find(const string_view_type& name) const noexcept
        {
            bool found = false;
            auto it = members_.begin();
            while (!found && it != members_.end())
            {
                if (it->key() == name)
                {
                    found = true;
                }
                else
                {
                    ++it;
                }
            }
            return it;
        }

        iterator erase(const_iterator pos) 
        {
            if (pos != members_.end())
            {
    #if defined(JSONCONS_NO_VECTOR_ERASE_TAKES_CONST_ITERATOR)
                iterator it = members_.begin() + (pos - members_.begin());
                return members_.erase(it);
    #else
                return members_.erase(pos);
    #endif
            }
            else
            {
                return members_.end();
            }
        }

        iterator erase(const_iterator first, const_iterator last) 
        {
            std::size_t pos1 = first == members_.end() ? members_.size() : first - members_.begin();
            std::size_t pos2 = last == members_.end() ? members_.size() : last - members_.begin();

            if (pos1 < members_.size() && pos2 <= members_.size())
            {

    #if defined(JSONCONS_NO_VECTOR_ERASE_TAKES_CONST_ITERATOR)
                iterator it1 = members_.begin() + (first - members_.begin());
                iterator it2 = members_.begin() + (last - members_.begin());
                return members_.erase(it1,it2);
    #else
                return members_.erase(first,last);
    #endif
            }
            else
            {
                return members_.end();
            }
        }

        void erase(const string_view_type& name) 
        {
            auto pos = find(name);
            if (pos != members_.end())
            {
    #if defined(JSONCONS_NO_VECTOR_ERASE_TAKES_CONST_ITERATOR)
                iterator it = members_.begin() + (pos - members_.begin());
                members_.erase(it);
    #else
                members_.erase(pos);
    #endif
            }
        }

        static bool compare1(const index_key_value<Json>& item1, const index_key_value<Json>& item2)
        {
            int comp = item1.name.compare(item2.name); 
            if (comp < 0) return true;
            if (comp == 0) return item1.index < item2.index;

            return false;
        }

        static bool compare2(const index_key_value<Json>& item1, const index_key_value<Json>& item2)
        {
            return item1.index < item2.index;
        }

        void uninitialized_init(index_key_value<Json>* items, std::size_t length)
        {
            if (length > 0)
            {
                auto first = items;
                auto last = first + length;

                std::sort(first, last, compare1);

                std::size_t count = 1;
                for (std::size_t i = 1; i < length; ++i)
                {
                    while (i < length && items[i-1].name == items[i].name)
                    {
                        ++i;
                    }
                    if (i < length)
                    {
                        items[count] = items[i];
                        ++count;
                    }
                }

                last = first+count;
                std::sort(first, last, compare2);

                members_.reserve(count);
                for (auto it = first; it != last; ++it)
                {
                    members_.emplace_back(std::move(it->name), std::move(it->value));
                }
            }
        }

        template<class InputIt>
        void insert(InputIt first, InputIt last)
        {
            std::unordered_set<key_type,MyHash> keys;
            for (auto it = first; it != last; ++it)
            {
                auto kv = get_key_value<KeyT,Json>()(*it);
                if (keys.find(kv.key()) == keys.end())
                {
                    keys.emplace(kv.key());
                    members_.emplace_back(std::move(kv));
                }
            }
        }

        template<class InputIt>
        void insert(sorted_unique_range_tag, InputIt first, InputIt last)
        {
            for (auto it = first; it != last; ++it)
            {
                members_.emplace_back(get_key_value<KeyT,Json>()(*it));
            }
        }
   
        template <class T, class A=allocator_type>
        typename std::enable_if<extension_traits::is_stateless<A>::value,std::pair<iterator,bool>>::type
        insert_or_assign(const string_view_type& name, T&& value)
        {
            auto it = find(name);
            if (it == members_.end())
            {
                members_.emplace_back(key_type(name.begin(), name.end()), std::forward<T>(value));
                auto pos = members_.begin() + (members_.size() - 1);
                return std::make_pair(pos, true);
            }
            else
            {
                it->value(Json(std::forward<T>(value)));
                return std::make_pair(it,false);
            }
        }

        template <class T, class A=allocator_type>
        typename std::enable_if<!extension_traits::is_stateless<A>::value,std::pair<iterator,bool>>::type
        insert_or_assign(const string_view_type& name, T&& value)
        {
            auto it = find(name);
            if (it == members_.end())
            {
                members_.emplace_back(key_type(name.begin(),name.end(),get_allocator()), std::forward<T>(value));
                auto pos = members_.begin() + (members_.size()-1);
                return std::make_pair(pos,true);
            }
            else
            {
                it->value(Json(std::forward<T>(value),get_allocator()));
                return std::make_pair(it,false);
            }
        }

        template <class A=allocator_type, class T>
        typename std::enable_if<extension_traits::is_stateless<A>::value,iterator>::type 
        insert_or_assign(iterator hint, const string_view_type& key, T&& value)
        {
            if (hint == members_.end())
            {
                auto result = insert_or_assign(key, std::forward<T>(value));
                return result.first;
            }
            else
            {
                auto it = find(hint, key);
                if (it == members_.end())
                {
                    members_.emplace_back(key_type(key.begin(), key.end()), std::forward<T>(value));
                    auto pos = members_.begin() + (members_.size() - 1);
                    return pos;
                }
                else
                {
                    it->value(Json(std::forward<T>(value)));
                    return it;
                }
            }
        }

        template <class A=allocator_type, class T>
        typename std::enable_if<!extension_traits::is_stateless<A>::value,iterator>::type 
        insert_or_assign(iterator hint, const string_view_type& key, T&& value)
        {
            if (hint == members_.end())
            {
                auto result = insert_or_assign(key, std::forward<T>(value));
                return result.first;
            }
            else
            {
                auto it = find(hint, key);
                if (it == members_.end())
                {
                    members_.emplace_back(key_type(key.begin(),key.end(),get_allocator()), std::forward<T>(value));
                    auto pos = members_.begin() + (members_.size()-1);
                    return pos;
                }
                else
                {
                    it->value(Json(std::forward<T>(value),get_allocator()));
                    return it;
                }
            }
        }

        // merge

        void merge(const order_preserving_json_object& source)
        {
            for (auto it = source.begin(); it != source.end(); ++it)
            {
                try_emplace((*it).key(),(*it).value());
            }
        }

        void merge(order_preserving_json_object&& source)
        {
            auto it = std::make_move_iterator(source.begin());
            auto end = std::make_move_iterator(source.end());
            for (; it != end; ++it)
            {
                auto pos = find((*it).key());
                if (pos == members_.end() )
                {
                    try_emplace((*it).key(),std::move((*it).value()));
                }
            }
        }

        void merge(iterator hint, const order_preserving_json_object& source)
        {
            std::size_t pos = hint - members_.begin();
            for (auto it = source.begin(); it != source.end(); ++it)
            {
                hint = try_emplace(hint, (*it).key(),(*it).value());
                std::size_t newpos = hint - members_.begin();
                if (newpos == pos)
                {
                    ++hint;
                    pos = hint - members_.begin();
                }
                else
                {
                    hint = members_.begin() + pos;
                }
            }
        }

        void merge(iterator hint, order_preserving_json_object&& source)
        {
            std::size_t pos = hint - members_.begin();

            auto it = std::make_move_iterator(source.begin());
            auto end = std::make_move_iterator(source.end());
            for (; it != end; ++it)
            {
                hint = try_emplace(hint, (*it).key(), std::move((*it).value()));
                std::size_t newpos = hint - members_.begin();
                if (newpos == pos)
                {
                    ++hint;
                    pos = hint - members_.begin();
                }
                else
                {
                    hint = members_.begin() + pos;
                }
            }
        }

        // merge_or_update

        void merge_or_update(const order_preserving_json_object& source)
        {
            for (auto it = source.begin(); it != source.end(); ++it)
            {
                insert_or_assign((*it).key(),(*it).value());
            }
        }

        void merge_or_update(order_preserving_json_object&& source)
        {
            auto it = std::make_move_iterator(source.begin());
            auto end = std::make_move_iterator(source.end());
            for (; it != end; ++it)
            {
                auto pos = find((*it).key());
                if (pos == members_.end() )
                {
                    insert_or_assign((*it).key(),std::move((*it).value()));
                }
                else
                {
                    pos->value(std::move((*it).value()));
                }
            }
        }

        void merge_or_update(iterator hint, const order_preserving_json_object& source)
        {
            std::size_t pos = hint - members_.begin();
            for (auto it = source.begin(); it != source.end(); ++it)
            {
                hint = insert_or_assign(hint, (*it).key(),(*it).value());
                std::size_t newpos = hint - members_.begin();
                if (newpos == pos)
                {
                    ++hint;
                    pos = hint - members_.begin();
                }
                else
                {
                    hint = members_.begin() + pos;
                }
            }
        }

        void merge_or_update(iterator hint, order_preserving_json_object&& source)
        {
            std::size_t pos = hint - members_.begin();
            auto it = std::make_move_iterator(source.begin());
            auto end = std::make_move_iterator(source.end());
            for (; it != end; ++it)
            {
                hint = insert_or_assign(hint, (*it).key(), std::move((*it).value()));
                std::size_t newpos = hint - members_.begin();
                if (newpos == pos)
                {
                    ++hint;
                    pos = hint - members_.begin();
                }
                else
                {
                    hint = members_.begin() + pos;
                }
            }
        }

        // try_emplace

        template <class A=allocator_type, class... Args>
        typename std::enable_if<extension_traits::is_stateless<A>::value,std::pair<iterator,bool>>::type
        try_emplace(const string_view_type& name, Args&&... args)
        {
            auto it = find(name);
            if (it == members_.end())
            {
                members_.emplace_back(key_type(name.begin(), name.end()), std::forward<Args>(args)...);
                auto pos = members_.begin() + (members_.size()-1);
                return std::make_pair(pos,true);
            }
            else
            {
                return std::make_pair(it,false);
            }
        }

        template <class A=allocator_type, class... Args>
        typename std::enable_if<!extension_traits::is_stateless<A>::value,std::pair<iterator,bool>>::type
        try_emplace(const string_view_type& key, Args&&... args)
        {
            auto it = find(key);
            if (it == members_.end())
            {
                members_.emplace_back(key_type(key.begin(),key.end(), get_allocator()), 
                    std::forward<Args>(args)...);
                auto pos = members_.begin() + members_.size();
                return std::make_pair(pos,true);
            }
            else
            {
                return std::make_pair(it,false);
            }
        }
     
        template <class A=allocator_type, class ... Args>
        typename std::enable_if<extension_traits::is_stateless<A>::value,iterator>::type
        try_emplace(iterator hint, const string_view_type& key, Args&&... args)
        {
            if (hint == members_.end())
            {
                auto result = try_emplace(key, std::forward<Args>(args)...);
                return result.first;
            }
            else
            {
                auto it = find(hint, key);
                if (it == members_.end())
                {
                    members_.emplace_back(key_type(key.begin(),key.end(), get_allocator()), 
                        std::forward<Args>(args)...);
                    auto pos = members_.begin() + members_.size();
                    return pos;
                }
                else
                {
                    return it;
                }
            }
        }

        template <class A=allocator_type, class ... Args>
        typename std::enable_if<!extension_traits::is_stateless<A>::value,iterator>::type
        try_emplace(iterator hint, const string_view_type& key, Args&&... args)
        {
            if (hint == members_.end())
            {
                auto result = try_emplace(key, std::forward<Args>(args)...);
                return result.first;
            }
            else
            {
                auto it = find(hint, key);
                if (it == members_.end())
                {
                    members_.emplace_back(key_type(key.begin(),key.end(), get_allocator()), 
                        std::forward<Args>(args)...);
                    auto pos = members_.begin() + members_.size();
                    return pos;
                }
                else
                {
                    return it;
                }
            }
        }

        bool operator==(const order_preserving_json_object& rhs) const
        {
            return members_ == rhs.members_;
        }
     
        bool operator<(const order_preserving_json_object& rhs) const
        {
            return members_ < rhs.members_;
        }
    private:

        iterator find(iterator hint, const string_view_type& name) noexcept
        {
            bool found = false;
            auto it = hint;
            while (!found && it != members_.end())
            {
                if (it->key() == name)
                {
                    found = true;
                }
                else
                {
                    ++it;
                }
            }
            return found ? it : find(name);
        }

        void flatten_and_destroy() noexcept
        {
            if (!members_.empty())
            {
                json_array<Json> temp(get_allocator());

                for (auto&& kv : members_)
                {
                    if (kv.value().size() > 0)
                    {
                        temp.emplace_back(std::move(kv.value()));
                    }
                }
            }
        }
    };

} // namespace jsoncons

#endif
